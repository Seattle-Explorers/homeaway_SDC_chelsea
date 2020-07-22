const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB || 'localhost',
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  database: 'latitudedb',
  user: process.env.USER || 'chelseaschmidt',
  password: process.env.PW || '',
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports.pool = pool;
