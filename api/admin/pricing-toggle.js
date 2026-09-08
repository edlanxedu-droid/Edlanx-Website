const { requireAdmin } = require("../_lib/auth");
const { PLANS, FEATURES } = require("../_lib/pricing-catalog");
const { setPricingFeature } = require("../_lib/pricing-overrides");

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

  const plan = String(body.plan || "");
  const feature = String(body.feature || "");
  if (!PLANS.some((p) => p.key === plan)) {
    return res.status(400).json({ error: "Unknown plan" });
  }
  if (!FEATURES.some((f) => f.key === feature)) {
    return res.status(400).json({ error: "Unknown feature" });
  }

  await setPricingFeature(plan, feature, Boolean(body.enabled));
  return res.status(200).json({ ok: true, plan, feature, enabled: Boolean(body.enabled) });
});
