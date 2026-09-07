/* ============================================================
   Legal pages (Privacy Policy, Terms & Conditions, User Agreement).
   Fixed set of keys, pre-seeded by db/schema.sql, content and
   visibility edited from the admin panel.
   ============================================================ */

const { query } = require("./db");

const KNOWN_KEYS = ["privacy-policy", "terms-and-conditions", "user-agreement"];

async function getAllLegalPages() {
  const { rows } = await query("select key, title, content_html, enabled, updated_at from legal_pages order by key");
  return rows;
}

async function getLegalPage(key) {
  const { rows } = await query("select key, title, content_html, enabled, updated_at from legal_pages where key = $1", [key]);
  return rows[0] || null;
}

async function setLegalPageEnabled(key, enabled) {
  await query("update legal_pages set enabled = $2, updated_at = now() where key = $1", [key, Boolean(enabled)]);
}

async function setLegalPageContent(key, { title, content_html }) {
  await query(
    "update legal_pages set title = $2, content_html = $3, updated_at = now() where key = $1",
    [key, title, content_html]
  );
}

module.exports = { KNOWN_KEYS, getAllLegalPages, getLegalPage, setLegalPageEnabled, setLegalPageContent };
