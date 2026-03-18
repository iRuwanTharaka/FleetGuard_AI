require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'fleetguard_db',
    };

const client = new Client(config);
const migrationPath = path.join(__dirname, '..', '..', 'database', 'migrations', '004_sprint6_user_preferences.sql');

client
  .connect()
  .then(() => client.query(fs.readFileSync(migrationPath, 'utf8')))
  .then(() => {
    console.log('Sprint 6 migration applied.');
    client.end();
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
