const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');

router.get("/publisher", (req,res) => {
    sql.query(`SELECT pub_id, pub_name, year_established as est 
                FROM publisher
                ORDER BY pub_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("publisher", {pubs:rows});
        }
    });
});

module.exports = router;