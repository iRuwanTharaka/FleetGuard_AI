const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'fleetguard_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,
  max:                  20,
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('PostgreSQL connected'));
pool.on('error',  (err) => console.error('DB pool error:', err));

module.exports = pool;
