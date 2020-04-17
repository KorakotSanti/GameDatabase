const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');
let devname = null;

router.get("/developer", (req,res) => {
    
    if (devname != null) {
        sql.query(`SELECT dev_id, dev_name, year_established as est 
                    FROM developer
                    WHERE dev_name LIKE ${devname}
                    ORDER BY dev_name;`, (err, rows, fields) => {
        if (!err) {
            devname=null;
            res.render("developers/developer", {devs:rows});
        }
    });
    }
    else {
        sql.query(`SELECT dev_id, dev_name, year_established as est 
                    FROM developer
                    ORDER BY dev_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("developers/developer", {devs:rows});
        }
    });
    }
});

router.post("/developer", (req,res) => {
    devname = `"%` + req.body.devname + `%"`;
    res.redirect("/developer");
});

router.get("/developer/:id", (req,res) => {
    sql.query(`SELECT d.dev_id, dev_name, game_id, game_name, year_established as est
                FROM game INNER JOIN developer d on game.dev_id=d.dev_id
                WHERE d.dev_id = ${req.params.id};`, (err, rows, fields) => {
        if (!err) {
            let info = {
                "devid": rows[0]['dev_id'],
                "devname": rows[0]['dev_name'],
                "est": rows[0]['est']
            };

            let gameinfo = [];

            for (var i=0; i < rows.length; i++){
                gameinfo.push({"gameid":rows[i]['game_id'], "gamename":rows[i]['game_name']});
            }

            info['games'] = gameinfo;

            res.render("developers/showdev", {infos:info});
        } else {
            console.log(err);
            res.redirect("/developer");
        }
    })
});

module.exports = router;