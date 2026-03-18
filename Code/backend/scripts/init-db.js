/**
 * Creates fleetguard_db (if missing) and runs database/schema.sql.
 * Run from repo root: node backend/scripts/init-db.js
 * Or from backend: node scripts/init-db.js
 * Requires: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in env (backend/.env or export).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || 'fleetguard_db';
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');

async function main() {
  const baseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  };

  if (!baseConfig.password) {
    console.error('Set DB_PASSWORD in backend/.env (e.g. DB_PASSWORD=postgres)');
    process.exit(1);
  }

  const client = new Client({ ...baseConfig, database: 'postgres' });
  try {
    await client.connect();
    const check = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );
    if (check.rows.length === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Created database: ${DB_NAME}`);
    } else {
      console.log(`Database already exists: ${DB_NAME}`);
    }
  } catch (e) {
    console.error('Create database failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  const schemaClient = new Client({ ...baseConfig, database: DB_NAME });
  try {
    await schemaClient.connect();
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await schemaClient.query(sql);
    console.log('Schema applied successfully.');
  } catch (e) {
    console.error('Schema apply failed:', e.message);
    process.exit(1);
  } finally {
    await schemaClient.end();
  }
}

main();
