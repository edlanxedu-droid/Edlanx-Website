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
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;

  const candidatePbkdf2 = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512");
  const expected = Buffer.from(hash, "hex");
  if (candidatePbkdf2.length === expected.length && crypto.timingSafeEqual(candidatePbkdf2, expected)) {
    return true;
  }

  try {
    const candidateScrypt = crypto.scryptSync(password, salt, 64);
    if (candidateScrypt.length === expected.length && crypto.timingSafeEqual(candidateScrypt, expected)) {
      return true;
    }
  } catch { /* ignore */ }

  return false;
}

function base64urlEncode(strOrBuffer) {
  const buf = Buffer.isBuffer(strOrBuffer) ? strOrBuffer : Buffer.from(strOrBuffer, "utf8");
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64urlDecode(str) {
  let base64 = (str || "").replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) { base64 += "="; }
  return Buffer.from(base64, "base64").toString("utf8");
}

function getSecret() {
  return process.env.SESSION_SECRET || "edlanx-admin-session-secret-production-2026-key";
}

function sign(payload) {
  const body = base64urlEncode(JSON.stringify(payload));
  const sig = base64urlEncode(crypto.createHmac("sha256", getSecret()).update(body).digest());
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expectedSig = base64urlEncode(crypto.createHmac("sha256", getSecret()).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(base64urlDecode(body));
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
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`;
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
