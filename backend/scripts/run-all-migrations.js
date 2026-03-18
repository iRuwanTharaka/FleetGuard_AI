/**
 * Runs all database migrations in order (001 → 002 → 003 → 004).
 * Run from backend: node scripts/run-all-migrations.js
 * Supports: DATABASE_URL (Neon) or DB_* vars (local).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const MIGRATIONS = [
  '001_inspection_reviews_unique.sql',
  '002_sprint4_manager_fields.sql',
  '003_sprint5_gps_columns.sql',
  '003_sprint5_seed_gps.sql',
  '004_sprint6_user_preferences.sql',
];

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
  const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');

  try {
    await client.connect();
    for (const file of MIGRATIONS) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} (not found)`);
        continue;
      }
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
      console.log(`Applied: ${file}`);
    }
    console.log('All migrations applied.');
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
