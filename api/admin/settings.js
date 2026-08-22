const { requireAdmin } = require("../_lib/auth");
const { getSettings, setSettings } = require("../_lib/settings");

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    const settings = await getSettings();
    return res.status(200).json({
      brevo_api_key_set: Boolean(settings.brevo_api_key),
      notify_email: settings.notify_email,
      notify_from_email: settings.notify_from_email,
      notify_from_name: settings.notify_from_name,
      site_url: settings.site_url,
    });
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

  await setSettings(body);
  return res.status(200).json({ ok: true });
});
