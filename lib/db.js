/* ============================================================
   Shared Postgres connection pool for all /api serverless
   functions. Points at any Postgres you host yourself via
   DATABASE_URL — no dependency on a specific provider.
   ============================================================ */

const { Pool } = require("pg");

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Self-hosted Postgres usually presents a self-signed cert.
      // Set DATABASE_SSL=strict once you have a proper CA-signed cert.
      ssl:
        process.env.DATABASE_SSL === "off"
          ? false
          : { rejectUnauthorized: process.env.DATABASE_SSL === "strict" },
      max: 1, // one connection per serverless invocation; avoid exhausting Postgres max_connections
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = { getPool, query };
