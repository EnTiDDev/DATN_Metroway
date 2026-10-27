const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'trainticketmanagement',
  connectionLimit: 10,
});

// Promisify for async/await
pool.query = util.promisify(pool.query);

module.exports = pool;


