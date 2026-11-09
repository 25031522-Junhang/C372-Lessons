const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SoiDft2026',
  database: 'petcare'
});

module.exports = connection;
