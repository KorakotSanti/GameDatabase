const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');
let devname = null;

router.get("/developer", (req,res) => {
    
    if (devname != null) {
        sql.query(`SELECT dev_id, dev_name, ifnull(year_established, 'N/A') as est 
                    FROM developer
                    WHERE dev_name LIKE ${devname}
                    ORDER BY dev_name;`, (err, rows, fields) => {
        if (!err) {
            devname=null;
            res.render("developers/developer", {devs:rows});
        }
        else {
            console.log(err);
            res.redirect('/');
        }
    });
    }
    else {
        sql.query(`SELECT dev_id, dev_name, ifnull(year_established, 'N/A') as est 
                    FROM developer
                    ORDER BY dev_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("developers/developer", {devs:rows});
        }
        else {
            console.log(err);
            res.redirect("/");
        }
    });
    }
});

router.post("/developer", (req,res) => {
    devname = `"%` + req.body.devname + `%"`;
    res.redirect("/developer");
});

router.get("/developer/:id", (req,res) => {
    let developerid = req.params.id;
    sql.query(`SELECT d.dev_id, dev_name, game_id, game_name, ifnull(year_established, "N/A") as est
                FROM game INNER JOIN developer d on game.dev_id=d.dev_id
                WHERE d.dev_id = ${developerid};`, (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0) {
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
            }
            else {
                sql.query(`SELECT dev_id, dev_name, ifnull(year_established, 'N/A') as est
                            FROM developer where dev_id = ${developerid};`, (errr, rrow, field) => {
                    if (!err) {
                        let info ={
                            "devid": rows[0]['dev_id'],
                            "devname": rows[0]['dev_name'],
                            "est": rows[0]['est'],
                            "games": []
                        }
                        
                        res.render("developer/showdev");
                    }
                    else{
                        console.log(errr);
                        res.redirect("/developer");
                    }
                });
            }
            
        } else {
            console.log(err);
            res.redirect("/developer");
        }
    })
});

router.get("/developer/:id/edit", (req,res) => {
    sql.query(`SELECT dev_id, dev_name, ifnull(year_established, '') as est FROM developer WHERE dev_id = ${req.params.id};`, (err, rows, fields) => {
        if (!err) {
            let info = rows[0];
            res.render('developers/editdev', {info:info});
        }
        else {
            res.redirect(`/developer/${req.params.id}`);
        }
    });
});

router.put("/developer/:id", (req,res) => {
    let input = req.body;
    
    if (input.est == '' || input.est=='N/A') {
        input.est = null;
    } 
    else {
        input.est = `"${input.est}"`;
    }
    sql.query(`UPDATE developer SET dev_name="${input.devname}", year_established=${input.est} WHERE dev_id=${req.params.id};`);
    res.redirect(`/developer/${req.params.id}`);
});


module.exports = router;