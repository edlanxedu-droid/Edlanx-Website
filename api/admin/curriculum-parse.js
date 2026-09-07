const { requireAdmin } = require("../_lib/auth");
const { extractText, parseCurriculumText } = require("../_lib/curriculum-parser");

// Base64 in a JSON body runs ~1.33x the raw file size, and Vercel serverless
// functions cap request bodies around 4.5MB — keep well under that.
const MAX_BYTES = 3 * 1024 * 1024; // 3MB

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

  const filename = String(body.filename || "").trim();
  const contentBase64 = String(body.contentBase64 || "");
  if (!filename || !contentBase64) {
    return res.status(400).json({ error: "filename and contentBase64 are required" });
  }

  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (!["pdf", "docx", "txt"].includes(ext)) {
    return res.status(400).json({ error: "Only .pdf, .docx, and .txt files are supported" });
  }

  let buffer;
  try {
    buffer = Buffer.from(contentBase64, "base64");
  } catch {
    return res.status(400).json({ error: "Could not decode uploaded file" });
  }
  if (buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: "File is too large (15MB limit)" });
  }

  let text;
  try {
    text = await extractText(filename, buffer);
  } catch (err) {
    return res.status(400).json({ error: `Could not read this file: ${err.message}` });
  }

  const { modules, warnings } = parseCurriculumText(text);
  return res.status(200).json({ modules, warnings });
});
