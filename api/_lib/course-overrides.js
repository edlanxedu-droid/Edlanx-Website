/* ============================================================
   Admin overrides for the course catalog: per-course enabled
   flag and optional curriculum replacement. Missing row = the
   course is enabled with its default (courses-data.js) curriculum.
   ============================================================ */

const { query } = require("./db");

async function getAllOverrides() {
  const { rows } = await query("select slug, enabled, curriculum, updated_at from course_overrides");
  return rows;
}

async function setEnabled(slug, enabled) {
  await query(
    `insert into course_overrides (slug, enabled, updated_at) values ($1, $2, now())
     on conflict (slug) do update set enabled = excluded.enabled, updated_at = now()`,
    [slug, Boolean(enabled)]
  );
}

async function setCurriculum(slug, modules) {
  await query(
    `insert into course_overrides (slug, curriculum, updated_at) values ($1, $2, now())
     on conflict (slug) do update set curriculum = excluded.curriculum, updated_at = now()`,
    [slug, JSON.stringify(modules)]
  );
}

module.exports = { getAllOverrides, setEnabled, setCurriculum };
