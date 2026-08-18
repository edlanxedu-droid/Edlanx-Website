/* ============================================================
   Minimal Brevo transactional email sender. Settings (API key,
   sender identity) are passed in rather than read from env
   directly, since they're admin-panel-configurable now.
   ============================================================ */

async function sendEmail({ apiKey, fromEmail, fromName, toEmail, subject, html }) {
  if (!apiKey || !fromEmail || !toEmail) {
    throw new Error("Brevo not configured: missing api key, from email, or to email");
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: fromName || "Edlanx Website", email: fromEmail },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${text}`);
  }
}

module.exports = { sendEmail };
