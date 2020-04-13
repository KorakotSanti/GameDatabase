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

router.get("/game/:id", (req,res) => {
    result = sql.query(`select TheView.game_id, Game, Developer, Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity, genre_name, platform_name from TheView 
    left outer join game_genre on TheView.game_id=game_genre.game_id
    left outer join genre on game_genre.genre_id=genre.genre_id
    left outer join game_platform on TheView.game_id=game_platform.game_id
    left outer join platform on game_platform.platform_id=platform.platform_id
    where TheView.game_id=${req.params.id};`, (err, rows, fields) => {
        if(!err){
            let gamedata={
                "gamename":rows[0]['Game'], 
                "Developer":rows[0]['Developer'], 
                "Publisher":rows[0]['Publisher'], 
                "Quality": rows[0]['Quality'],
                "Maturity": rows[0]['Maturity']
            }

            let genres = new Set()
            let plat = new Set()

            for(var i=0; i < rows.length; i++) {
                genres.add(rows[i]['genre_name']);
                plat.add(rows[i]['platform_name']);
            }

            gamedata['genres'] = Array.from(genres);
            gamedata['platforms'] = Array.from(plat);

            console.log(gamedata);
            res.render("showgame", {game:gamedata});
        } else {
            console.log(err);
            res.redirect("/game");
        }
    });
});

module.exports = router;