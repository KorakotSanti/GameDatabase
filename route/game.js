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
    result = sql.query(
        `select TheView.game_id, Game, Developer, Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity, genre_name, platform_name, ifnull(image, 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6') as image 
        from TheView 
        left outer join game_genre on TheView.game_id=game_genre.game_id
        left outer join genre on game_genre.genre_id=genre.genre_id
        left outer join game_platform on TheView.game_id=game_platform.game_id
        left outer join platform on game_platform.platform_id=platform.platform_id
        where TheView.game_id=${req.params.id};`, (err, rows, fields) => {
        if(!err){
            let gamedata={
                "gameid": rows[0]['game_id'],
                "gamename":rows[0]['Game'], 
                "Developer":rows[0]['Developer'], 
                "Publisher":rows[0]['Publisher'], 
                "Quality": rows[0]['Quality'],
                "Maturity": rows[0]['Maturity'],
                "image": rows[0]['image']
            }

            let genres = new Set()
            let plat = new Set()

            for(var i=0; i < rows.length; i++) {
                genres.add(rows[i]['genre_name']);
                plat.add(rows[i]['platform_name']);
            }

            gamedata['genres'] = Array.from(genres);
            gamedata['platforms'] = Array.from(plat);

            res.render("showgame", {game:gamedata});
        } else {
            console.log(err);
            res.redirect("/game");
        }
    });
});

router.delete("/game/:id", (req,res)=> {
    let id = req.params.id;
    result = sql.query(`DELETE FROM game WHERE game_id=${id}`, (err, rows, fields) => {
        if (!err) {
            res.redirect("/game");
        } else {
            console.log(err);
            res.redirect("/game");
        }
    })
});


router.get("/game/:id/edit", (req,res) => {
    result = sql.query(
        `select TheView.game_id, Game, Developer, Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity, genre_name, platform_name, ifnull(image, 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6') as image 
        from TheView 
        left outer join game_genre on TheView.game_id=game_genre.game_id
        left outer join genre on game_genre.genre_id=genre.genre_id
        left outer join game_platform on TheView.game_id=game_platform.game_id
        left outer join platform on game_platform.platform_id=platform.platform_id
        where TheView.game_id=${req.params.id};`, (err, rows, fields) => {
        if(!err){
            let gamedata={
                "gameid": rows[0]['game_id'],
                "gamename":rows[0]['Game'], 
                "Developer":rows[0]['Developer'], 
                "Publisher":rows[0]['Publisher'], 
                "Quality": rows[0]['Quality'],
                "Maturity": rows[0]['Maturity'],
                "image": rows[0]['image']
            }

            let genres = new Set()
            let plat = new Set()

            for(var i=0; i < rows.length; i++) {
                genres.add(rows[i]['genre_name']);
                plat.add(rows[i]['platform_name']);
            }

            gamedata['genres'] = Array.from(genres);
            gamedata['platforms'] = Array.from(plat);

            if (gamedata['genres'].length == 0) {
                gamedata['genres'] = ['N/A'];
            }
            if (gamedata['platforms'].length == 0) {
                gamedata['platforms'] = ['N/A'];
            }

            res.render("editgames", {game:gamedata});
        } else {
            console.log(err);
            res.redirect("/game");
        }
    });
});

router.put("/game/:id", (req,res) => {
    let input = req.body;
    
    sql.query(`SELECT * FROM developer WHERE dev_name='${input.dev}'`, (err, rows, fields) => {
        if (rows.length==0) {
            sql.query(`INSERT INTO developer (dev_name) VALUES ('${input.dev}')`);
        }
    });

    sql.query(`SELECT * FROM publisher WHERE pub_name='${input.pub}'`, (err, rows, fields) => {
        if (rows.length==0) {
            sql.query(`INSERT INTO developer (pub_name) VALUES ('${input.pub}')`);
        }
    });

    sql.query(`UPDATE game SET game_name='${input.gamename}', q_rating=${Number(input.quality)}, m_rating='${input.maturity}', dev_id=(SELECT dev_id FROM developer WHERE dev_name='${input.dev}'), pub_id=(SELECT pub_id FROM publisher WHERE pub_name='${input.pub}'), image='${input.image}' WHERE game_id=${req.params.id}`, (err,rows,fields) => {
        if (!err) {
            res.redirect(`/game/${req.params.id}`);
        }
        else {
            console.log(err);
            res.redirect(`/game/${req.params.id}`);
        }
    });
});

module.exports = router;