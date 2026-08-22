const { query } = require("../lib/db");
const { requireAdmin } = require("../lib/auth");

module.exports = requireAdmin(async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 25));
  const offset = (page - 1) * pageSize;
  const status = (req.query.status || "").trim();
  const q = (req.query.q || "").trim();

  const where = [];
  const params = [];
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    where.push(`(full_name ilike $${params.length} or email ilike $${params.length} or phone ilike $${params.length})`);
  }
  const whereSql = where.length ? `where ${where.join(" and ")}` : "";

  const countRes = await query(`select count(*)::int as count from website_leads ${whereSql}`, params);
  const listParams = [...params, pageSize, offset];
  const listRes = await query(
    `select id, full_name, email, phone, course_interest, message, source, page_url, status, thank_you_sent, created_at
     from website_leads ${whereSql}
     order by created_at desc
     limit $${listParams.length - 1} offset $${listParams.length}`,
    listParams
  );

  return res.status(200).json({
    total: countRes.rows[0].count,
    page,
    pageSize,
    leads: listRes.rows,
  });
});
