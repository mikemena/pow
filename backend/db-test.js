// require('dotenv').config();
require('dotenv').config({
  path: '/Users/mike/Documents/purple.nosync/workout-tracker-app/.env'
});

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) throw err;

  pool.end();
});
