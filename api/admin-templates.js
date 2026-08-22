const { requireAdmin } = require("./_lib/auth");
const { getAllTemplates, setTemplate, renderPreview, TEMPLATE_KEYS } = require("./_lib/templates");

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    const templates = await getAllTemplates();
    return res.status(200).json({ templates });
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

  if (body.preview) {
    const rendered = renderPreview(body.subject || "", body.html_body || "");
    return res.status(200).json(rendered);
  }

  const { key, subject, html_body } = body;
  if (!key || !TEMPLATE_KEYS.includes(key)) {
    return res.status(400).json({ error: `Invalid template key: ${key}` });
  }
  if (!subject || !html_body) {
    return res.status(400).json({ error: "Subject and HTML body are required" });
  }

  await setTemplate(key, subject, html_body);
  return res.status(200).json({ ok: true });
});
