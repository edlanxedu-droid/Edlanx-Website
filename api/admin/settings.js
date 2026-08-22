/* ============================================================
   GET  /api/admin/settings   -> current Brevo/notify config
   POST /api/admin/settings   -> update it (partial allowed)
   ============================================================ */

const path = require("path");
const { requireAdmin } = require(path.join(process.cwd(), "lib", "auth"));
const { getSettings, setSettings } = require(path.join(process.cwd(), "lib", "settings"));

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    const settings = await getSettings();
    // Never echo the full API key back to the browser — just enough to confirm it's set.
    return res.status(200).json({
      ...settings,
      brevo_api_key: settings.brevo_api_key ? maskKey(settings.brevo_api_key) : "",
      brevo_api_key_set: Boolean(settings.brevo_api_key),
    });
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    const update = {};
    if (typeof body.notify_email === "string") update.notify_email = body.notify_email.trim();
    if (typeof body.notify_from_email === "string") update.notify_from_email = body.notify_from_email.trim();
    if (typeof body.notify_from_name === "string") update.notify_from_name = body.notify_from_name.trim();
    if (typeof body.site_url === "string") update.site_url = body.site_url.trim();
    // Only overwrite the API key if a new non-masked value was actually submitted.
    if (typeof body.brevo_api_key === "string" && body.brevo_api_key.trim() && !body.brevo_api_key.includes("••••")) {
      update.brevo_api_key = body.brevo_api_key.trim();
    }

    await setSettings(update);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
});

function maskKey(key) {
  if (key.length <= 6) return "••••••";
  return `${key.slice(0, 4)}••••••${key.slice(-2)}`;
}
