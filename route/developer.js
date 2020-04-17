const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');

router.get("/developer", (req,res) => {
    sql.query(`SELECT dev_id, dev_name, year_established as est 
                FROM developer
                ORDER BY dev_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("developer", {devs:rows});
        }
    });
});

module.exports = router;