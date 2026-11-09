const connection = require('../config/db');

function create(username, password, name, role, callback) {
  const sql = 'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [username, password, name, role], callback);
}

function findByCredentials(username, password, callback) {
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], callback);
}

function list(callback) {
  const sql = 'SELECT id, name, username, role FROM users';
  connection.query(sql, callback);
}

function findById(id, callback) {
  const sql = 'SELECT id, name, username, role FROM users WHERE id = ?';
  connection.query(sql, [id], callback);
}

function deleteById(id, callback) {
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], callback);
}

module.exports = { create, findByCredentials, list, findById, deleteById };
