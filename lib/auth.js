/* ============================================================
   Admin auth helpers: password hashing (scrypt) and signed
   session cookies (HMAC). No external deps — Node's built-in
   crypto module is enough for a single-admin-role panel.
   ============================================================ */

const crypto = require("crypto");

const COOKIE_NAME = "edlanx_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function createSessionCookie(user) {
  const token = sign({ uid: user.id, username: user.username, exp: Date.now() + SESSION_TTL_MS });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function parseCookies(header) {
  const out = {};
  (header || "").split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  return verify(cookies[COOKIE_NAME]);
}

/** Wrap an API handler so it 401s without a valid admin session. */
function requireAdmin(handler) {
  return async (req, res) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    req.admin = session;
    return handler(req, res);
  };
}

module.exports = {
  COOKIE_NAME,
  hashPassword,
  verifyPassword,
  createSessionCookie,
  clearSessionCookie,
  getSession,
  requireAdmin,
};
