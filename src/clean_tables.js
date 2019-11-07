const { Pool } = require("pg");

async function dropTables() {
  const pool = new Pool();
  await pool.query("DROP TABLE lighthouse_members;");
  await pool.query("DROP TABLE lighthouse_ranks;");
  await pool.query("DROP TABLE lighthouse_teams;");
}

dropTables();

module.exports = { dropTables };
