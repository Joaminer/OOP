// config/dbConfig.js
const mysql = require('mysql2');
const {db} = require('./config');

console.log(db)
const pool = mysql.createPool(db);
const promisePool = pool.promise();

module.exports = promisePool;
