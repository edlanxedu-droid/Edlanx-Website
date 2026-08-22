const { query } = require("./_lib/db");
const { getSettings } = require("./_lib/settings");
const { getTemplate, render } = require("./_lib/templates");
const { sendEmail } = require("./_lib/brevo");

function isValidEmail(v) { return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v) { return typeof v === "string" && /^[0-9+\-\s()]{7,15}$/.test(v); }

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const full_name = (body.full_name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const course_interest = (body.course_interest || "").trim();
  const message = (body.message || "").trim();
  const source = (body.source || "website").trim();
  const page_url = (body.page_url || "").trim();

  if (!full_name || !email || !phone) {
    return res.status(400).json({ error: "full_name, email, and phone are required" });
  }
  if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email" });
  if (!isValidPhone(phone)) return res.status(400).json({ error: "Invalid phone" });

  const lead = {
    full_name, email, phone,
    course_interest: course_interest || null,
    message: message || null,
    source,
    page_url: page_url || null,
    user_agent: req.headers["user-agent"] || null,
  };

  let leadId;
  try {
    const { rows } = await query(
      `insert into website_leads (full_name, email, phone, course_interest, message, source, page_url, user_agent)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [lead.full_name, lead.email, lead.phone, lead.course_interest, lead.message, lead.source, lead.page_url, lead.user_agent]
    );
    leadId = rows[0].id;
  } catch (err) {
    console.error("Postgres insert error:", err);
    return res.status(502).json({ error: "Could not save lead" });
  }

  // Email failures never fail the request — the lead is already saved.
  sendLeadEmails(lead).catch((err) => console.error("Lead email dispatch failed:", err));

  return res.status(200).json({ ok: true, id: leadId });
};

async function sendLeadEmails(lead) {
  const settings = await getSettings();
  if (!settings.brevo_api_key) {
    console.error("Brevo not configured (no API key in admin settings or env) — skipping lead emails");
    return;
  }

  const tokenData = { ...lead, first_name: (lead.full_name || "").split(" ")[0] || lead.full_name, site_url: settings.site_url || "" };

  const [internal, thankyou] = await Promise.all([
    getTemplate("internal_notification"),
    getTemplate("student_thankyou"),
  ]);

  const sends = [];

  if (internal && settings.notify_email) {
    sends.push(
      sendEmail({
        apiKey: settings.brevo_api_key,
        fromEmail: settings.notify_from_email,
        fromName: settings.notify_from_name,
        toEmail: settings.notify_email,
        subject: render(internal.subject, tokenData),
        html: render(internal.html_body, tokenData),
      }).catch((err) => console.error("Internal notification email failed:", err))
    );
  }

  if (thankyou) {
    sends.push(
      sendEmail({
        apiKey: settings.brevo_api_key,
        fromEmail: settings.notify_from_email,
        fromName: settings.notify_from_name,
        toEmail: lead.email,
        subject: render(thankyou.subject, tokenData),
        html: render(thankyou.html_body, tokenData),
      }).catch((err) => console.error("Thank-you email failed:", err))
    );
  }

  await Promise.all(sends);
}
