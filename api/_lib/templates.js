/* ============================================================
   Editable email templates. {{token}} placeholders are
   substituted with escaped values at send/preview time.
   ============================================================ */

const { query } = require("./db");

const TEMPLATE_KEYS = ["internal_notification", "student_thankyou"];

const SAMPLE_DATA = {
  full_name: "Aditi Sharma",
  first_name: "Aditi",
  email: "aditi.sharma@example.com",
  phone: "+91 98765 43210",
  course_interest: "Full Stack Web Development",
  message: "I'd like to know more about placement support.",
  source: "register_page",
  page_url: "https://edlanx.com/register.html",
  site_url: "https://edlanx.com",
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render(str, data) {
  return String(str ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => escapeHtml(data[key] ?? ""));
}

async function getTemplate(key) {
  const { rows } = await query("select key, subject, html_body, updated_at from email_templates where key = $1", [key]);
  return rows[0] || null;
}

async function getAllTemplates() {
  const { rows } = await query("select key, subject, html_body, updated_at from email_templates order by key");
  return rows;
}

async function setTemplate(key, { subject, html_body }) {
  if (!TEMPLATE_KEYS.includes(key)) throw new Error(`Unknown template key: ${key}`);
  await query(
    `insert into email_templates (key, subject, html_body, updated_at) values ($1, $2, $3, now())
     on conflict (key) do update set subject = excluded.subject, html_body = excluded.html_body, updated_at = now()`,
    [key, subject, html_body]
  );
}

function renderPreview(subject, htmlBody, overrides) {
  const data = { ...SAMPLE_DATA, ...(overrides || {}) };
  return { subject: render(subject, data), html: render(htmlBody, data) };
}

module.exports = { TEMPLATE_KEYS, SAMPLE_DATA, escapeHtml, render, getTemplate, getAllTemplates, setTemplate, renderPreview };
