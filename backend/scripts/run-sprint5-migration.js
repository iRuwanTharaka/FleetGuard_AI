/**
 * Runs Sprint 5 database migrations (GPS columns + seed data).
 * Run from backend: node scripts/run-sprint5-migration.js
 * Supports: DATABASE_URL (Neon) or DB_* vars (local).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'fleetguard_db',
      };

  if (!process.env.DATABASE_URL && !config.password) {
    console.error('Set DATABASE_URL or DB_PASSWORD in backend/.env');
    process.exit(1);
  }

  const client = new Client(config);
  try {
    await client.connect();

    const migrationPath = path.join(__dirname, '..', '..', 'database', 'migrations', '003_sprint5_gps_columns.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    await client.query(migration);
    console.log('Sprint 5 migration (GPS columns) applied.');

    const seedPath = path.join(__dirname, '..', '..', 'database', 'migrations', '003_sprint5_seed_gps.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      await client.query(seed);
      console.log('Sprint 5 seed data applied.');
    }
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
