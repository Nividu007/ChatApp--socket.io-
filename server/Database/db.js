require('dotenv').config();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
})

let usersTable = "SELECT * FROM users;";
let roomTable = "SELECT * FROM chatroom;";

pool.execute(usersTable, function(err, result) {
  if(err) throw err;
})

module.exports = pool.promise();