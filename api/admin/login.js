/* ============================================================
   POST /api/admin/login  { username, password }
   Verifies against admin_users and sets a signed session cookie.
   ============================================================ */

const { query } = require("../../lib/db");
const { verifyPassword, createSessionCookie } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const username = (body.username || "").trim();
  const password = body.password || "";
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  const { rows } = await query("select id, username, password_hash from admin_users where username = $1", [username]);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  await query("update admin_users set last_login_at = now() where id = $1", [user.id]);

  res.setHeader("Set-Cookie", createSessionCookie(user));
  return res.status(200).json({ ok: true, username: user.username });
};
