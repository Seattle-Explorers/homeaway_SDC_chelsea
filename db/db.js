const { Pool } = require('pg');

const host = process.env.DB || 'localhost';
const user = process.env.USER || 'chelseaschmidt';
const password = process.env.PW || '';

const pool = new Pool({
  host,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  database: 'latitudedb',
  user,
  password,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports.pool = pool;
