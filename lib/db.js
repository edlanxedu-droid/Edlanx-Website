/* ============================================================
   Shared Postgres connection pool for all /api serverless
   functions. Points at any Postgres you host yourself via
   DATABASE_URL — no dependency on a specific provider.
   ============================================================ */

const { Pool } = require("pg");

let pool;

const DEFAULT_SUPABASE_URL = "postgres://postgres.qadsoznpvjlomdhllcsx:Website%40edlanx@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || DEFAULT_SUPABASE_URL;
    pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "off"
        ? false
        : { rejectUnauthorized: false },
      max: 1, // one connection per serverless invocation; avoid exhausting Postgres max_connections
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { getPool, query };
