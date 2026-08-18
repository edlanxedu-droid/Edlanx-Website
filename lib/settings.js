/* ============================================================
   Runtime-configurable settings (Brevo API key, notify emails).
   Reads from the admin_settings table first; falls back to the
   matching env var if the admin panel hasn't set it yet, so the
   site keeps working immediately after a fresh deploy.
   ============================================================ */

const { query } = require("./db");

const ENV_FALLBACK = {
  brevo_api_key: "BREVO_API_KEY",
  notify_email: "NOTIFY_EMAIL",
  notify_from_email: "NOTIFY_FROM_EMAIL",
  notify_from_name: "NOTIFY_FROM_NAME",
  site_url: "SITE_URL",
};

async function getSettings() {
  const { rows } = await query("select key, value from admin_settings");
  const fromDb = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const result = {};
  for (const [key, envVar] of Object.entries(ENV_FALLBACK)) {
    result[key] = (fromDb[key] ?? "").trim() || process.env[envVar] || "";
  }
  return result;
}

async function setSettings(values) {
  const keys = Object.keys(ENV_FALLBACK);
  for (const key of keys) {
    if (!(key in values)) continue;
    await query(
      `insert into admin_settings (key, value, updated_at) values ($1, $2, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [key, String(values[key] ?? "")]
    );
  }
}

module.exports = { getSettings, setSettings };
