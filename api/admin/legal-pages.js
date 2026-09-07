const { requireAdmin } = require("../_lib/auth");
const { KNOWN_KEYS, getAllLegalPages, setLegalPageContent } = require("../_lib/legal-pages");

module.exports = requireAdmin(async (req, res) => {
  if (req.method === "GET") {
    const pages = await getAllLegalPages();
    return res.status(200).json({ pages });
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

  const key = String(body.key || "");
  if (!KNOWN_KEYS.includes(key)) {
    return res.status(400).json({ error: "Unknown legal page key" });
  }
  const title = String(body.title || "").trim();
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  await setLegalPageContent(key, { title, content_html: String(body.content_html || "") });
  return res.status(200).json({ ok: true, key });
});
