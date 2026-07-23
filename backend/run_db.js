const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fitaix',
  password: 'mohit123',
  port: 5432,
});

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
