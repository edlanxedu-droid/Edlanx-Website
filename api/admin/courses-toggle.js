const { requireAdmin } = require("../_lib/auth");
const { setEnabled } = require("../_lib/course-overrides");
const { getCourse } = require("../../public/js/courses-data.js");

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

  const slug = String(body.slug || "").trim();
  if (!slug || !getCourse(slug)) {
    return res.status(400).json({ error: "Unknown course slug" });
  }

  await setEnabled(slug, Boolean(body.enabled));
  return res.status(200).json({ ok: true, slug, enabled: Boolean(body.enabled) });
});
