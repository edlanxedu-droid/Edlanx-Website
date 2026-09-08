/* ============================================================
   Public endpoint: pricing feature overrides, read by the
   pricing-feature toggle script in main.js so an admin change
   takes effect on the live site without a redeploy.
   ============================================================ */

const { getAllPricingOverrides } = require("./_lib/pricing-overrides");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rows = await getAllPricingOverrides();
  const out = {};
  for (const row of rows) {
    out[`${row.plan_key}:${row.feature_key}`] = row.enabled;
  }

  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  return res.status(200).json(out);
};
