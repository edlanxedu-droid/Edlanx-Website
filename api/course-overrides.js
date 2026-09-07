/* ============================================================
   Public endpoint: which courses are disabled / have a replacement
   curriculum. Read by public/js/courses-data.js on every page load
   so an admin toggle takes effect without a redeploy.
   ============================================================ */

const { getAllOverrides } = require("./_lib/course-overrides");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rows = await getAllOverrides();
  const out = {};
  for (const row of rows) {
    out[row.slug] = { enabled: row.enabled, curriculum: row.curriculum || null };
  }

  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  return res.status(200).json(out);
};
