/*  eslint-env browser */

const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const { JSDOM } = require("jsdom");
const { insert, insertMembers } = require("./update_tables");

const TEAM_URL = "https://coding-challenge.lighthouselabs.ca/teams/info/";

const extractTeams = async () => {
  const TEAM_URL = "https://coding-challenge.lighthouselabs.ca/teams/info/";
  const nodes = Array.from(document.querySelector("#prizing_Wrap").children);
  const entries = [];
  for (let i = 0; i < nodes.length; i += 2) {
    const entry = {
      title: nodes[i].innerText,
      id: nodes[i].children[0].href.replace(TEAM_URL, ""),
      score: +nodes[i + 1].innerText,
      rank: i / 2
    };
    entries.push(entry);
  }
  return entries;
};

const MEMBER_REGEX = /<section class="my_Team__Wrap">[\s\S]+<\/section>/;
const parser = text => new JSDOM(text);
const extractMembers = (teamId, teamData) => {
  const xmlDoc = parser(teamData.match(MEMBER_REGEX)[0]).window.document;

  return Array.from(xmlDoc.querySelectorAll(".my_Team_Members__Inner")).map(
    member => {
      const name = member.children[0].textContent.trim();
      const score = +member.children[1].textContent;
      return { team_id: teamId, name, score };
    }
  );
};

const fetchMembers = async teamList => {
  const requests = teamList.map(({ id }) => [fetch(`${TEAM_URL}${id}`), id]);
  return requests.map(async ([request, teamId]) => {
    const response = await request;
    const data = await response.text();
    return extractMembers(teamId, data);
  });
};

(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  // Extract the results from the page.
  await page.goto(
    "https://coding-challenge.lighthouselabs.ca/teams/leaderboard"
  );
  const resultsSelector = "prizing_Wrap";
  await page.waitForSelector(`#${resultsSelector}`, { visible: true });
  const list = await page.evaluate(extractTeams, resultsSelector);
  await insert(list);

  const fetchResults = await Promise.all(await fetchMembers(list));
  await insertMembers(fetchResults.flat());

  await browser.close();
})();
