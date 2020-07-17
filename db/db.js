/* eslint-disable no-console */
const Console = require('console');
const { Client } = require('pg');

const host = process.env.DB || 'localhost';
const client = new Client({
  host,
  database: 'latitudedb'
});
client.connect()

module.exports.client = client;