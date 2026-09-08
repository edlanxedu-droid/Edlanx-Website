const { requireAdmin } = require("../_lib/auth");
const { PLANS, FEATURES, defaultFor } = require("../_lib/pricing-catalog");
const { getAllPricingOverrides } = require("../_lib/pricing-overrides");

module.exports = requireAdmin(async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const overrides = new Map((await getAllPricingOverrides()).map((r) => [`${r.plan_key}:${r.feature_key}`, r.enabled]));

  const matrix = PLANS.map((plan) => ({
    key: plan.key,
    name: plan.name,
    features: FEATURES.map((f) => {
      const overrideKey = `${plan.key}:${f.key}`;
      const enabled = overrides.has(overrideKey) ? overrides.get(overrideKey) : defaultFor(plan.key, f.key);
      return { key: f.key, label: f.label, enabled };
    }),
  }));

  return res.status(200).json({ plans: PLANS, features: FEATURES, matrix });
});
