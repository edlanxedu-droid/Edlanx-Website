/* ============================================================
   Curriculum file parsing: extract raw text from an uploaded
   PDF / Word / plain-text file, then apply the same numbered
   module/topic heuristic used to build the reference JSON in
   content-updates/curriculum-parsed/ (ported from
   content-updates/parse_curricula.py, tuned against Edlanx's
   real curriculum brochures).
   ============================================================ */

const TOP_RE = /^\s*(\d{1,2})\s+(?!\d)([A-Z][A-Za-z0-9&,'/:.\-() ]{3,})$/;
const TOP_DOT_RE = /^\s*(\d{1,2})\.\s+([A-Z][A-Za-z0-9&,'/:.\-() ]{3,})$/;
const SUB_SEARCH_RE = /^\s*(?:\d{1,2}\s+)?(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?\s+([A-Z(].+)$/;
const BARE_LINE_RE = /^[A-Z][A-Za-z0-9&,'/:\-() ]{2,80}$/;
const STOP_MARKERS = ["WHY CHOOSE", "Why This Journey", "DIRECT MENTORSHIP", "Projects:"];
const SKIP_EXACT = new Set(["EDLANX", "Program Overview", "The Edlanx Methodology", "Our Development Philosophy", "The Edlanx Advantage"]);

function clean(s) {
  return s.replace(/\s+/g, " ").trim().replace(/\.+$/, "");
}

function hasDigit(s) {
  return /\d/.test(s);
}

/** JS port of parse_curricula.py's parse_file(), operating on already-extracted text. */
function parseCurriculumText(rawText) {
  const rawLines = String(rawText || "").split(/\r?\n/);

  let start = 0;
  for (let i = 0; i < rawLines.length; i++) {
    if (rawLines[i].includes("Table of Contents")) {
      start = i + 1;
      break;
    }
  }

  let stop = rawLines.length;
  for (let i = start; i < rawLines.length; i++) {
    if (STOP_MARKERS.some((m) => rawLines[i].includes(m))) {
      stop = i;
      break;
    }
  }

  let body = rawLines.slice(start, stop).map((l) => l.trim());
  body = body.filter((l) => l && !SKIP_EXACT.has(l));

  const explicitTitles = {};
  const topicsByModule = {};
  const order = [];
  const barePool = []; // [index, text]

  let i = 0;
  const n = body.length;
  while (i < n) {
    const l = body[i];
    const mTop = TOP_RE.exec(l) || TOP_DOT_RE.exec(l);
    const mSub = SUB_SEARCH_RE.exec(l);

    if (mTop && !mSub) {
      const num = parseInt(mTop[1], 10);
      const titleParts = [clean(mTop[2])];
      let j = i + 1;
      while (j < n) {
        const nxt = body[j];
        if (SUB_SEARCH_RE.exec(nxt) || TOP_RE.exec(nxt) || TOP_DOT_RE.exec(nxt)) break;
        if (BARE_LINE_RE.test(nxt) && !hasDigit(nxt)) {
          titleParts.push(clean(nxt));
          j += 1;
          continue;
        }
        break;
      }
      if (!(num in explicitTitles)) explicitTitles[num] = clean(titleParts.join(" "));
      i = j;
      continue;
    }

    if (mSub) {
      const num = parseInt(mSub[1], 10);
      const text = clean(mSub[4]);
      if (text && text.length >= 3) {
        if (!topicsByModule[num]) topicsByModule[num] = [];
        if (!order.includes(num)) order.push(num);
        topicsByModule[num].push(text);
      }
      i += 1;
      continue;
    }

    if (BARE_LINE_RE.test(l) && !hasDigit(l)) {
      barePool.push([i, clean(l)]);
    }
    i += 1;
  }

  const allNums = Array.from(new Set([...Object.keys(topicsByModule), ...Object.keys(explicitTitles)].map(Number))).sort((a, b) => a - b);
  const missingTitleNums = allNums.filter((num) => !(num in explicitTitles));

  const candidates = [];
  let k = 0;
  while (k < barePool.length) {
    const [idx, text] = barePool[k];
    const parts = [text];
    let k2 = k + 1;
    while (k2 < barePool.length && barePool[k2][0] === barePool[k2 - 1][0] + 1) {
      parts.push(barePool[k2][1]);
      k2 += 1;
    }
    candidates.push(parts.join(" "));
    k = k2;
  }

  let ci = 0;
  for (const num of missingTitleNums) {
    if (ci < candidates.length) {
      explicitTitles[num] = candidates[ci];
      ci += 1;
    } else {
      explicitTitles[num] = `Module ${num}`;
    }
  }

  const modules = allNums.map((num) => ({
    title: explicitTitles[num] || `Module ${num}`,
    topics: topicsByModule[num] || [],
  }));

  const warnings = [];
  if (!modules.length) {
    warnings.push("No numbered modules were detected in this file. Try a file with numbered sections (e.g. \"1 Module Title\", \"1.1 Topic\").");
  }
  const weakTitles = modules.filter((m) => m.title.startsWith("Module ") || m.title.split(" ").length < 2);
  if (weakTitles.length) {
    warnings.push(`${weakTitles.length} module title(s) could not be confidently detected and were left as placeholders — review before approving.`);
  }

  return { modules, warnings };
}

async function extractText(filename, buffer) {
  const ext = (filename.split(".").pop() || "").toLowerCase();

  if (ext === "pdf") {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === "docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // .txt and any other plain-text-ish file
  return buffer.toString("utf8");
}

module.exports = { parseCurriculumText, extractText };
