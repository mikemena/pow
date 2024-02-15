const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  connectionString: process.env.DATABASE_URL
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool // Export the pool object for more advanced operations like transactions
};
