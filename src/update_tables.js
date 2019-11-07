const format = require("pg-format");
const { Pool } = require("pg");

async function insertTeam(data = [], pool = new Pool()) {
  const titles = data.map(({ id, title }) => [id, title]);
  const titleQuery =
    "INSERT INTO lighthouse_teams(id, title) VALUES %L ON CONFLICT DO NOTHING";
  await pool.query(format(titleQuery, titles));
}

async function insertRanks(data = [], pool = new Pool()) {
  const now = new Date();
  const ranks = data.map(({ id, score, rank }) => [id, score, rank, now]);
  const rankQuery =
    "INSERT INTO lighthouse_ranks(id, score, rank, date) VALUES %L ON CONFLICT DO NOTHING";
  await pool.query(format(rankQuery, ranks));
}

async function insertMembers(data = [], pool = new Pool()) {
  const now = new Date();
  const members = data.map(({ team_id, name, score }) => [
    team_id,
    name,
    score,
    now
  ]);
  const memberQuery =
    "INSERT INTO lighthouse_members(team_id, name, score, date) VALUES %L ON CONFLICT DO NOTHING";
  await pool.query(format(memberQuery, members));
}

async function insert(data = []) {
  const pool = new Pool();
  await insertTeam(data, pool);
  await insertRanks(data, pool);
}
module.exports = {
  insert,
  insertTeam,
  insertRanks,
  insertMembers
};
