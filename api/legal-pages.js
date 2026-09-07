/* ============================================================
   Public endpoint: legal page content + visibility, read by
   public/legal.html and the footer link script in main.js.
   ============================================================ */

const { getAllLegalPages } = require("./_lib/legal-pages");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rows = await getAllLegalPages();
  const out = {};
  for (const row of rows) {
    out[row.key] = { title: row.title, content_html: row.enabled ? row.content_html : "", enabled: row.enabled };
  }

  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  return res.status(200).json(out);
};
