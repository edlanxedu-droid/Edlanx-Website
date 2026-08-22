/* ============================================================
   GET  /api/admin/account   -> current admin's username
   POST /api/admin/account   -> change username and/or password
        body: { current_password, new_username?, new_password? }
        Requires current_password to make any change. Reissues
        the session cookie so a username change doesn't log the
        admin out mid-edit.
   ============================================================ */

const path = require("path");
const { query } = require(path.join(process.cwd(), "lib", "db"));
const { requireAdmin, verifyPassword, hashPassword, createSessionCookie } = require(path.join(process.cwd(), "lib", "auth"));

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

  const currentPassword = body.current_password || "";
  const newUsername = (body.new_username || "").trim();
  const newPassword = body.new_password || "";

  if (!currentPassword) {
    return res.status(400).json({ error: "Current password is required" });
  }
  if (newPassword && newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const { rows } = await query("select id, username, password_hash from admin_users where id = $1", [req.admin.uid]);
  const user = rows[0];
  if (!user || !verifyPassword(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const finalUsername = newUsername || user.username;

  if (finalUsername !== user.username) {
    const { rows: existing } = await query("select id from admin_users where username = $1 and id != $2", [finalUsername, user.id]);
    if (existing.length) {
      return res.status(400).json({ error: "That username is already taken" });
    }
  }

  const finalPasswordHash = newPassword ? hashPassword(newPassword) : user.password_hash;

  await query("update admin_users set username = $1, password_hash = $2 where id = $3", [finalUsername, finalPasswordHash, user.id]);

  res.setHeader("Set-Cookie", createSessionCookie({ id: user.id, username: finalUsername }));
  return res.status(200).json({ ok: true, username: finalUsername });
});
