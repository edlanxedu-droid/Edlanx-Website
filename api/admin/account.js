const { query } = require("../_lib/db");
const { requireAdmin, verifyPassword, hashPassword, createSessionCookie } = require("../_lib/auth");

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    return res.status(200).json({ username: req.admin.username });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const current_password = body.current_password || "";
  const new_username = (body.new_username || "").trim();
  const new_password = body.new_password || "";

  if (!current_password) {
    return res.status(400).json({ error: "Current password is required to save changes" });
  }

  const { rows } = await query("select id, username, password_hash from admin_users where id = $1", [req.admin.uid]);
  const user = rows[0];
  if (!user || !verifyPassword(current_password, user.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  let updatedUsername = user.username;

  if (new_username && new_username !== user.username) {
    const check = await query("select id from admin_users where username = $1 and id <> $2", [new_username, user.id]);
    if (check.rows.length) {
      return res.status(409).json({ error: "Username is already taken" });
    }
    await query("update admin_users set username = $1, updated_at = now() where id = $2", [new_username, user.id]);
    updatedUsername = new_username;
  }

  if (new_password) {
    if (new_password.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }
    const hash = hashPassword(new_password);
    await query("update admin_users set password_hash = $1, updated_at = now() where id = $2", [hash, user.id]);
  }

  res.setHeader("Set-Cookie", createSessionCookie({ id: user.id, username: updatedUsername }));
  return res.status(200).json({ ok: true, username: updatedUsername });
});
