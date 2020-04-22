const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');
let pubname = null;

// get all the publisher for publisher page
router.get("/publisher", (req,res) => {
    if (pubname != null) {
        sql.query(`SELECT pub_id, pub_name, ifnull(year_established, 'N/A') as est 
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
        sql.query(`SELECT pub_id, pub_name, ifnull(year_established, 'N/A') as est 
                    FROM publisher
                    ORDER BY pub_name;`, (err, rows, fields) => {
        if (!err) {
            res.render("publishers/publisher", {pubs:rows});
        }
    });

    }
});

// when user submit form to search for publisher based on input name
router.post("/publisher", (req,res) => {
    pubname = `"%` + req.body.pubname + `%"`;
    res.redirect("/publisher");
});

// get indivdual publisher page with all its information
router.get("/publisher/:id", (req,res) => {
    let publisherid = req.params.id;
    sql.query(`SELECT p.pub_id, pub_name, game_id, game_name, ifnull(year_established,'N/A') as est
                FROM game INNER JOIN publisher p on game.pub_id=p.pub_id
                WHERE p.pub_id = ${publisherid};`, (err, rows, fields) => {

        if (!err) {
            // cchecks if publisher has any games in the database
            if (rows.length > 0) {
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
            }
            else {
                sql.query(`SELECT pub_id, pub_name, ifnull(year_established, 'N/A') as est
                            FROM publisher WHERE pub_id = ${publisherid};`, (err, rrow, field) => {
                    if (!err) {
                        let info = {
                            "pubid": rrow[0]['pub_id'],
                            "pubname": rrow[0]['pub_name'],
                            "est": rrow[0]['est'],
                            "games": []
                        }
                        res.render("publishers/showpub", {infos:info});
                    }
                    else {
                        console.log(errr);
                        res.redirect("/publisher");
                    }
                });
            } 
            
        } else {
            console.log(err);
            res.redirect("/publisher");
        }
    })
});

// get the publisher edit page to edit publisher name or/and year established
router.get("/publisher/:id/edit", (req,res) => {
    sql.query(`SELECT pub_id, pub_name, ifnull(year_established, '') as est FROM publisher WHERE pub_id = ${req.params.id};`, (err, rows, fields) => {
        if (!err) {
            let info = rows[0];
            res.render('publishers/editpub', {info:info});
        }
        else {
            res.redirect(`/publisher/${req.params.id}`);
        }
    });
});

// this is when user submit forms to update the publisher
router.put("/publisher/:id", (req,res) => {
    let input = req.body;
    if (input.est == '' || input.est == 'N/A') {
        input.est = null;
    } else {
        input.est = `"${input.est}"`;
    }
    sql.query(`UPDATE publisher SET pub_name="${input.pubname}", year_established=${input.est} WHERE pub_id=${req.params.id};`);
    
    res.redirect(`/publisher/${req.params.id}`);
});


module.exports = router;