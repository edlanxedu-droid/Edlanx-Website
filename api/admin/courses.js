const { requireAdmin } = require("../_lib/auth");
const { getAllOverrides } = require("../_lib/course-overrides");
const { COURSES, DEPARTMENTS } = require("../../public/js/courses-data.js");

module.exports = requireAdmin(async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const overrides = Object.fromEntries((await getAllOverrides()).map((r) => [r.slug, r]));
  const deptName = Object.fromEntries(DEPARTMENTS.map((d) => [d.slug, d.name]));

  const courses = COURSES.map((c) => {
    const override = overrides[c.slug];
    return {
      slug: c.slug,
      name: c.name,
      departments: c.departments.map((d) => deptName[d] || d),
      moduleCount: (override?.curriculum || c.modules || []).length,
      enabled: override ? override.enabled : true,
      hasCustomCurriculum: Boolean(override?.curriculum),
      updatedAt: override?.updated_at || null,
    };
  });

  return res.status(200).json({ courses });
});
