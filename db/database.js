const mysql         = require('mysql')
const dbConfig      = require('../config.js');

const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

connection.connect((err)=>{
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection