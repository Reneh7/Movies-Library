const pg = require("pg");
const DB_URL = process.env.DATABASE_URL;
const client = new pg.Client(DB_URL);

module.exports = client;