/* ============================================================
   GET  /api/admin/templates              -> both templates
   POST /api/admin/templates { key, subject, html_body }
        -> save one template
   POST /api/admin/templates { preview: true, subject, html_body }
        -> render with sample data, no save (used by the live preview pane)
   ============================================================ */

const { requireAdmin } = require("../../lib/auth");
const { getAllTemplates, setTemplate, renderPreview, TEMPLATE_KEYS } = require("../../lib/templates");

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    const templates = await getAllTemplates();
    return res.status(200).json({ templates });
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    if (body.preview) {
      const { subject, html } = renderPreview(body.subject || "", body.html_body || "");
      return res.status(200).json({ subject, html });
    }

    const { key, subject, html_body } = body;
    if (!TEMPLATE_KEYS.includes(key)) {
      return res.status(400).json({ error: `key must be one of: ${TEMPLATE_KEYS.join(", ")}` });
    }
    if (!subject || !html_body) {
      return res.status(400).json({ error: "subject and html_body are required" });
    }

    await setTemplate(key, { subject, html_body });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
});
