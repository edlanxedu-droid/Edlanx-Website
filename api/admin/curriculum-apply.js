const { requireAdmin } = require("../_lib/auth");
const { setCurriculum } = require("../_lib/course-overrides");
const { getCourse } = require("../../public/js/courses-data.js");

function isValidModules(modules) {
  return Array.isArray(modules) && modules.length > 0 && modules.every((m) =>
    m && typeof m.title === "string" && m.title.trim() &&
    Array.isArray(m.topics) && m.topics.every((t) => typeof t === "string")
  );
}

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

  const slug = String(body.slug || "").trim();
  if (!slug || !getCourse(slug)) {
    return res.status(400).json({ error: "Unknown course slug" });
  }

  const modules = body.modules;
  if (!isValidModules(modules)) {
    return res.status(400).json({ error: "modules must be a non-empty array of { title, topics: string[] }" });
  }

  const cleaned = modules.map((m) => ({
    title: m.title.trim(),
    topics: m.topics.map((t) => t.trim()).filter(Boolean),
  }));

  await setCurriculum(slug, cleaned);
  return res.status(200).json({ ok: true, slug, moduleCount: cleaned.length });
});
