const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres', // Matches Docker service name
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

module.exports = { pool };