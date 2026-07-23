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
    
    // Insert a dummy user so foreign keys work
    await pool.query(`INSERT INTO users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com') ON CONFLICT DO NOTHING;`);
    console.log('Dummy user inserted.');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await pool.end();
  }
}

run();
