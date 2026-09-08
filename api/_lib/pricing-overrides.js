/* ============================================================
   Admin overrides for pricing plan features. A missing row means
   "use the default from pricing-catalog.js" — only cells an admin
   has actually toggled get a row here.
   ============================================================ */

const { query } = require("./db");

async function getAllPricingOverrides() {
  const { rows } = await query("select plan_key, feature_key, enabled, updated_at from pricing_overrides");
  return rows;
}

async function setPricingFeature(planKey, featureKey, enabled) {
  await query(
    `insert into pricing_overrides (plan_key, feature_key, enabled, updated_at) values ($1, $2, $3, now())
     on conflict (plan_key, feature_key) do update set enabled = excluded.enabled, updated_at = now()`,
    [planKey, featureKey, Boolean(enabled)]
  );
}

module.exports = { getAllPricingOverrides, setPricingFeature };
