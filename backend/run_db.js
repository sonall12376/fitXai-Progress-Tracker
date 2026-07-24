const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const pool = new Pool(
  process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'fitaix',
        password: process.env.DB_PASSWORD || 'mohit123',
        port: parseInt(process.env.DB_PORT || '5432', 10),
      }
);

async function run() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('Schema executed successfully.');
    
    const seedSql = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await pool.query(seedSql);
    console.log('Seed data inserted successfully.');
    
  } catch (err) {
    console.error('Error executing DB scripts:', err);
  } finally {
    await pool.end();
  }
}

run();
