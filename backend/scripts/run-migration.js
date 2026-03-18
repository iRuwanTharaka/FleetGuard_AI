/**
 * Runs a SQL migration file against fleetguard_db.
 * Usage: node scripts/run-migration.js [migration-file]
 * Default: database/migrations/002_sprint4_manager_fields.sql
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationFile = process.argv[2] || path.join(__dirname, '..', '..', 'database', 'migrations', '002_sprint4_manager_fields.sql');

async function main() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'fleetguard_db',
  };

  if (!config.password) {
    console.error('Set DB_PASSWORD in backend/.env');
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFile, 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  const client = new Client(config);
  try {
    await client.connect();
    console.log(`Running migration: ${migrationFile}`);
    for (const stmt of statements) {
      const clean = stmt.replace(/^\s*--.*$/gm, '').trim();
      if (!clean) continue;
      try {
        await client.query(clean);
        console.log('  OK:', clean.substring(0, 60) + '...');
      } catch (e) {
        if (e.code === '42701') {
          console.log('  SKIP (column/index exists):', clean.substring(0, 50) + '...');
        } else {
          throw e;
        }
      }
    }
    console.log('Migration completed successfully.');
  } catch (e) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
