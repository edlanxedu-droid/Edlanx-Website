/* ============================================================
   Base pricing plan / feature matrix — mirrors the default
   is-yes/is-off state baked into public/pricing.html. Admin
   overrides in the pricing_overrides table flip individual
   cells without needing a redeploy.
   ============================================================ */

const PLANS = [
  { key: "flexlearn", name: "FlexLearn" },
  { key: "learn-mentor", name: "Learn+Mentor" },
  { key: "career-pro", name: "CareerPro" },
  { key: "career-pro-plus", name: "CareerPro Plus" },
];

const FEATURES = [
  { key: "certificate", label: "Certificate" },
  { key: "full-course-access", label: "Full course access" },
  { key: "assignments", label: "Assignments" },
  { key: "mock-interview", label: "Mock interview" },
  { key: "resume-support", label: "Resume support" },
  { key: "placement-support", label: "Placement support" },
  { key: "interview-guarantee", label: "Interview guarantee" },
  { key: "internship", label: "Internship" },
];

// Default enabled state per plan, matching the static HTML today.
const DEFAULTS = {
  flexlearn: { certificate: true, "full-course-access": true, assignments: true, "mock-interview": false, "resume-support": false, "placement-support": false, "interview-guarantee": false, internship: false },
  "learn-mentor": { certificate: true, "full-course-access": true, assignments: true, "mock-interview": true, "resume-support": false, "placement-support": false, "interview-guarantee": false, internship: false },
  "career-pro": { certificate: true, "full-course-access": true, assignments: true, "mock-interview": true, "resume-support": true, "placement-support": true, "interview-guarantee": true, internship: true },
  "career-pro-plus": { certificate: true, "full-course-access": true, assignments: true, "mock-interview": true, "resume-support": true, "placement-support": true, "interview-guarantee": true, internship: true },
};

function defaultFor(planKey, featureKey) {
  return Boolean(DEFAULTS[planKey]?.[featureKey]);
}

module.exports = { PLANS, FEATURES, DEFAULTS, defaultFor };
