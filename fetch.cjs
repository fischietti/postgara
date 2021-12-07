/** Fetch Data **/

require("dotenv").config();
const { writeFileSync } = require("fs");

const SPREADSHEET = "17tC2SE2qxwq7CcpEAX2VSYb6swkA4k2fb85CUBQ20m0";
const RANGE = "Database!A1:E1000";

const SERVICE_ACCOUNT = process.env.SERVICE_ACCOUNT;
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

function fetch() {
  getRows((rows) => {
    const restaurants = rows.map(parseRestaurant);
    const json = JSON.stringify(restaurants, null, 2);
    writeFileSync("src/lib/Map/restaurants.json", json);
  });
}

/** Data Parsing **/

function parseRestaurant(row) {
  return {
    name: row["Nome"],
    proposalDate: row["DataProposta"].substr(0, 8),
    address: row["Indirizzo"],
    google: row["LinkGoogle"],
    coordinates: row["Coordinate"].split(/[\/,]/).map(Number),
  };
}

/** Data Retrieval **/

function getRows(resolve) {
  getJWT((jwt) => {
    getValues(jwt, SPREADSHEET, RANGE, (values) => {
      const header = values[0];
      const rows = values.slice(1).map(rowBuilder(header));
      resolve(rows);
    });
  });
}

function rowBuilder(header) {
  return (row) => {
    return header.reduce((acc, column, index) => {
      acc[column] = row[index];
      return acc;
    }, {});
  };
}

function getValues(jwt, spreadsheetId, range, resolve) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
  );

  const headers = { Authorization: `Bearer ${jwt}` };

  get(url, headers, (res) => {
    resolve(res.values);
  });
}

/** Authentication **/

const { Buffer } = require("buffer");
const { createSign } = require("crypto");

function getJWT(resolve) {
  const url = new URL("https://oauth2.googleapis.com/token");

  const body = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: buildBearerToken(),
  };

  post(url, body, {}, (res) => {
    resolve(res.access_token);
  });
}

function buildBearerToken() {
  const header = Buffer.from('{"alg":"RS256","typ":"JWT"}', "utf8").toString(
    "base64url"
  );

  const now = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(
    `{
    "iss": "${SERVICE_ACCOUNT}",
    "scope": "https://www.googleapis.com/auth/spreadsheets.readonly",
    "aud": "https://oauth2.googleapis.com/token",
    "exp": ${now + 3600},
    "iat": ${now}
  }`
  ).toString("base64url");

  const sign = createSign("SHA256");
  sign.write(`${header}.${claims}`);
  sign.end();
  const signature = sign.sign(PRIVATE_KEY, "base64url");

  return `${header}.${claims}.${signature}`;
}

/** HTTP requests **/

const https = require("https");

function get(url, headers, resolve) {
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: "GET",
    headers: {
      ...headers,
      ...{
        Accept: "application/json",
      },
    },
  };

  const req = https.request(options, (res) => {
    const chunks = [];
    res.on("data", (chunk) => chunks.push(chunk.toString()));
    res.on("end", () => resolve(JSON.parse(chunks.join())));
  });

  req.end();
}

function post(url, body, headers, resolve) {
  const data = new TextEncoder().encode(JSON.stringify(body));

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: "POST",
    headers: {
      ...headers,
      ...{
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    },
  };

  const req = https.request(options, (res) => {
    const chunks = [];
    res.on("data", (chunk) => chunks.push(chunk.toString()));
    res.on("end", () => resolve(JSON.parse(chunks.join())));
  });

  req.write(data);
  req.end();
}

/** MAIN */

fetch();
