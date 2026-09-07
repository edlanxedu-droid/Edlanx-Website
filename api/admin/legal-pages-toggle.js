const { requireAdmin } = require("../_lib/auth");
const { KNOWN_KEYS, setLegalPageEnabled } = require("../_lib/legal-pages");

module.exports = requireAdmin(async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const key = String(body.key || "");
  if (!KNOWN_KEYS.includes(key)) {
    return res.status(400).json({ error: "Unknown legal page key" });
  }

  await setLegalPageEnabled(key, Boolean(body.enabled));
  return res.status(200).json({ ok: true, key, enabled: Boolean(body.enabled) });
});
