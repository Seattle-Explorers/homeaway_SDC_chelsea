const { Pool } = require('pg');

const host = process.env.DB;
const user = process.env.USER;
const password = process.env.PW;

const pool = new Pool({
  host: host || 'localhost',
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  database: 'latitudedb',
  user: user || 'chelseaschmidt',
  password: password || '',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log(`connected to ${host} by user ${user}`);
});

module.exports.pool = pool;
