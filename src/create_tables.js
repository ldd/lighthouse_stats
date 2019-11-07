const { Pool } = require("pg");

const createTableTeams = `
CREATE TABLE lighthouse_teams(
  id TEXT PRIMARY KEY,
  title TEXT not null
);
`;

const createTableRanks = `
CREATE TABLE lighthouse_ranks(
  id TEXT,
  score SMALLINT,
  rank int2,
  date TIMESTAMP,
  FOREIGN KEY (id) REFERENCES  lighthouse_teams(id)
);
`;

const createTableMembers = `
CREATE TABLE lighthouse_members(
  id SERIAL PRIMARY KEY,
  team_id TEXT,
  name TEXT not null,
  score SMALLINT,
  date TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES lighthouse_teams(id)
);
`;

async function createTables() {
  const pool = new Pool();
  await pool.query(createTableTeams);
  await pool.query(createTableRanks);
  await pool.query(createTableMembers);
}

createTables();

module.exports = {
  createTables
};
