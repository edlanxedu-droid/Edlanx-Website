/* ============================================================
   Shared Postgres connection pool for all /api serverless
   functions. Points at any Postgres you host yourself via
   DATABASE_URL — no dependency on a specific provider.
   ============================================================ */

const { Pool } = require("pg");

const DEFAULT_CONFIG = {
  user: "postgres.qadsoznpvjlomdhllcsx",
  password: "Website@edlanx",
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  max: 1,
};

let pool;

function getPool() {
  if (!pool) {
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === "off"
          ? false
          : { rejectUnauthorized: false },
        max: 1,
      });
    } else {
      pool = new Pool(DEFAULT_CONFIG);
    }
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { getPool, query };
