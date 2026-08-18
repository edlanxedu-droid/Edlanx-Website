#!/usr/bin/env node
/* ============================================================
   Production server (Railway) and local dev server (npm run dev).
   Emulates the same /api file-based routing + rewrites that
   vercel.json describes, on top of static file serving — this
   file is what actually runs in both places now; vercel.json is
   inert unless the site is ever redeployed back to Vercel.
   ============================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = __dirname;
const PORT = process.env.PORT || 4173;
const isProd = process.env.NODE_ENV === "production";

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
};

const REWRITES = [
  { test: /^\/departments\/?$/, dest: "/departments/index.html" },
  { test: /^\/departments\/([^/]+)\/?$/, dest: (m) => `/departments/department.html?slug=${m[1]}` },
  { test: /^\/courses\/([^/]+)\/?$/, dest: (m) => `/course.html?slug=${m[1]}` },
  { test: /^\/admin\/?$/, dest: "/admin/index.html" },
];

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

function wrapResponse(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(obj)); };
  return res;
}

async function handleApi(req, res, urlObj) {
  const apiPath = urlObj.pathname.replace(/^\/api\//, "");
  const filePath = path.join(ROOT, "api", `${apiPath}.js`);
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    return res.end("API route not found: " + apiPath);
  }
  // Hot-reload handler modules in dev only; in production keep them cached.
  if (!isProd) delete require.cache[require.resolve(filePath)];
  const handler = require(filePath);

  req.query = Object.fromEntries(urlObj.searchParams);
  if (req.method === "POST" || req.method === "PUT") {
    const raw = await readBody(req);
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
  }

  wrapResponse(res);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(`[api/${apiPath}] error:`, err);
    if (!res.headersSent) res.status(500).json({ error: "Internal error" });
  }
}

function serveStatic(req, res, pathname) {
  let filePath = path.join(ROOT, decodeURIComponent(pathname));
  if (pathname.endsWith("/") || !path.extname(pathname)) {
    const asDir = path.join(filePath, "index.html");
    filePath = fs.existsSync(asDir) ? asDir : `${filePath}.html`;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const fallback = path.join(ROOT, "index.html");
    filePath = fs.existsSync(filePath + ".html") ? filePath + ".html" : fallback;
  }
  if (pathname.startsWith("/admin")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.statusCode = 404; return res.end("Not found"); }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  let pathname = urlObj.pathname;

  if (pathname.startsWith("/api/")) {
    return handleApi(req, res, urlObj);
  }

  for (const rule of REWRITES) {
    const m = pathname.match(rule.test);
    if (m) {
      const dest = typeof rule.dest === "function" ? rule.dest(m) : rule.dest;
      const destUrl = new URL(dest, "http://x");
      return serveStatic(req, res, destUrl.pathname);
    }
  }

  serveStatic(req, res, pathname === "/" ? "/index.html" : pathname);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT} (${isProd ? "production" : "development"})`));
