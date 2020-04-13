const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');

let game_title = null;

router.get("/game", (req,res) => {
    let result = null;
    if (game_title != null) {
        result = sql.query(`SELECT game_id, Game, Developer, Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity FROM TheView WHERE Game LIKE ${game_title};`, (err,rows,fields) => {
            if (!err) {
                res.render("game", {games:rows})
            } else {
                console.log(err);
            }
        });
    } else {
        result = sql.query("SELECT game_id, Game, Developer, Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity FROM TheView;", (err,rows,fields) => {
            if (!err) {
                res.render("game", {games:rows})
            } else {
                console.log(err);
            }
        });
    }
});

router.post("/game", (req,res) => {
    game_title = "'%" + req.body.gamename + "%'";
    res.redirect("/game");
});

module.exports = router;