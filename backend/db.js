const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'game_platform',
});

module.exports = db;
