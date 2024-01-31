// require('dotenv').config();
require('dotenv').config({
  path: '/Users/mike/Documents/purple.nosync/workout-tracker-app/.env'
});

const { Pool } = require('pg');

console.log('Connection String:', process.env.DATABASE_URL); // For debugging

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) throw err;
  console.log('Connection Successful:', res.rows);
  pool.end();
});
