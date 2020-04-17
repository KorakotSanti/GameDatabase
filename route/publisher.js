const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');
let pubname = null;

router.get("/publisher", (req,res) => {
    if (pubname != null) {
        sql.query(`SELECT pub_id, pub_name, year_established as est 
                    FROM publisher
                    WHERE pub_name LIKE ${pubname}
                    ORDER BY pub_name;`, (err, rows, fields) => {
        if (!err) {
            pubname=null;
            res.render("publishers/publisher", {pubs:rows});
        }
    });
    }
    else {
        sql.query(`SELECT pub_id, pub_name, year_established as est 
                    FROM publisher
                    ORDER BY pub_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("publishers/publisher", {pubs:rows});
        }
    });

    }
});

router.post("/publisher", (req,res) => {
    pubname = `"%` + req.body.pubname + `%"`;
    res.redirect("/publisher");
});

router.get("/publisher/:id", (req,res) => {
    sql.query(`SELECT p.pub_id, pub_name, game_id, game_name, year_established as est
                FROM game INNER JOIN publisher p on game.pub_id=p.pub_id
                WHERE p.pub_id = ${req.params.id};`, (err, rows, fields) => {
        if (!err) {
            let info = {
                "pubid": rows[0]['pub_id'],
                "pubname": rows[0]['pub_name'],
                "est": rows[0]['est']
            };

            let gameinfo = [];

            for (var i=0; i < rows.length; i++){
                gameinfo.push({"gameid":rows[i]['game_id'], "gamename":rows[i]['game_name']});
            }

            info['games'] = gameinfo;

            res.render("publishers/showpub", {infos:info});
        } else {
            console.log(err);
            res.redirect("/publisher");
        }
    })
});


module.exports = router;