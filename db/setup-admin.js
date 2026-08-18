#!/usr/bin/env node
/* ============================================================
   One-time CLI to create (or reset) an admin panel login.
   Run against the same DATABASE_URL the deployed site uses:

     DATABASE_URL=postgres://... node db/setup-admin.js <username> <password>

   There is no sign-up flow on the website itself on purpose —
   admin accounts are only created from the server side.
   ============================================================ */

const { Pool } = require("pg");
const { hashPassword } = require("../lib/auth");

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Usage: DATABASE_URL=... node db/setup-admin.js <username> <password>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL env var is required.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "off" ? false : { rejectUnauthorized: process.env.DATABASE_SSL === "strict" },
  });

  const password_hash = hashPassword(password);

  await pool.query(
    `insert into admin_users (username, password_hash) values ($1, $2)
     on conflict (username) do update set password_hash = excluded.password_hash`,
    [username, password_hash]
  );

  console.log(`Admin user "${username}" is ready.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
