const express = require('express');
const router = express.Router();
const sql = require('../db/database.js');
let game_title = null;
let genreList, platformList;
let genrename = "(SELECT genre_name from genre)";
let platname = "(SELECT platform_name from platform)";

// get list of genres
sql.query('SELECT genre_name from genre', (err, rows, fields) => {
    if (!err) {
        genreList=rows;
    }
    else {
        console.log(err);
    }
});

// get list of platforms
sql.query('SELECT platform_name from platform', (err, rows, fields) => {
    if (!err) {
        platformList=rows;
    }
    else {
        console.log(err);
    }
});

router.get("/game", (req,res) => {

    if (game_title != null) {
        sql.query(`SELECT DISTINCT(TheView.game_id), Game, ifnull(Developer,'N/A') as Developer, ifnull(Publisher, 'N/A') as Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity FROM TheView 
                    LEFT OUTER JOIN game_genre as gg on gg.game_id=TheView.game_id
                    LEFT OUTER JOIN genre on gg.genre_id=genre.genre_id
                    LEFT OUTER JOIN game_platform as gp on gp.game_id=TheView.game_id
                    LEFT OUTER JOIN platform on gp.platform_id=platform.platform_id
                    WHERE Game LIKE ${game_title}
                    AND genre_name IN ${genrename}
                    AND platform_name IN ${platname}
                    ORDER BY Game;`, (err,rows,fields) => {
            if (!err) {
                game_title=null;
                genrename = "(SELECT genre_name from genre)";
                platname = "(SELECT platform_name from platform)";
                res.render("games/game", {games:rows,genres:genreList,platforms:platformList})
            } else {
                console.log(err);
            }
        });
    } else {
        sql.query(`SELECT DISTINCT(TheView.game_id), Game, ifnull(Developer, 'N/A') as Developer, ifnull(Publisher, 'N/A') as Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity
                    FROM TheView
                    LEFT OUTER JOIN game_genre as gg on gg.game_id=TheView.game_id
                    LEFT OUTER JOIN genre on gg.genre_id=genre.genre_id
                    LEFT OUTER JOIN game_platform as gp on gp.game_id=TheView.game_id
                    LEFT OUTER JOIN platform on gp.platform_id=platform.platform_id
                    WHERE (genre_name IN ${genrename})
                    AND (platform_name IN ${platname})
                    ORDER BY Game;`, (err,rows,fields) => {
            if (!err) {
                genrename = "(SELECT genre_name from genre)";
                platname = "(SELECT platform_name from platform)";
                res.render("games/game", {games:rows,genres:genreList,platforms:platformList})
            } else {
                console.log(err);
            }
        });
    }
});

router.post("/game", (req,res) => {
    game_title = `"%` + req.body.gamename + `%"`;
    if (req.body.genre == "all") {
        genrename = "(SELECT genre_name from genre)";
    } else {
        genrename = "('"+req.body.genre+"')";
    }

    if (req.body.platform == "all") {
        platname = "(SELECT platform_name from platform)";
    } else {
        platname = "('"+req.body.platform+"')";
    }
    res.redirect("/game");
});

router.get("/game/:id", (req,res) => {
    result = sql.query(
        `select TheView.game_id, Game, ifnull(Developer,'N/A') as Developer, ifnull(Publisher,'N/A') as Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity, genre_name, platform_name, ifnull(image, 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6') as image 
        from TheView 
        left outer join game_genre on TheView.game_id=game_genre.game_id
        left outer join genre on game_genre.genre_id=genre.genre_id
        left outer join game_platform on TheView.game_id=game_platform.game_id
        left outer join platform on game_platform.platform_id=platform.platform_id
        where TheView.game_id=${req.params.id};`, (err, rows, fields) => {
        if(!err){
            if (rows.length > 0) {
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

                res.render("games/showgame", {game:gamedata});
            }
            else {
                res.redirect("/game");
            }
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
        `select TheView.game_id, Game, ifnull(Developer,'N/A') as Developer, ifnull(Publisher,'N/A') as Publisher, ifnull(Quality,'N/A') as Quality, ifnull(Maturity, 'N/A') as Maturity, genre_name, platform_name, ifnull(image, 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6') as image 
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

            res.render("games/editgames", {game:gamedata});
        } else {
            console.log(err);
            res.redirect("/game");
        }
    });
});

router.put("/game/:id", (req,res) => {
    let input = req.body;
    for (var item in input) {
        if (input[item] == '' || input[item] == 'N/A'){
            input[item] = 'NULL';
        }
    }

    sql.query(`SELECT * FROM developer WHERE dev_name="${input.dev}";`, (err, rows, fields) => {
        if (rows.length==0) {
            sql.query(`INSERT INTO developer (dev_name) VALUES ("${input.dev}");`);
        }

        sql.query(`SELECT * FROM publisher WHERE pub_name="${input.pub}";`, (err, rows, fields) => {
            if (rows.length==0) {
                sql.query(`INSERT INTO publisher (pub_name) VALUES ("${input.pub}");`);
                console.log("adding");
            }
            sql.query(`UPDATE game SET game_name="${input.gamename}", q_rating=${input.quality}, m_rating='${input.maturity}', dev_id=(SELECT dev_id FROM developer WHERE dev_name="${input.dev}"), pub_id=(SELECT pub_id FROM publisher WHERE pub_name="${input.pub}"), image='${input.image}' WHERE game_id=${req.params.id};`, (err,rows,fields) => {
                if (!err) {
                    res.redirect(`/game/${req.params.id}`);
                }
                else {
                    console.log(err);
                    res.redirect(`/game/${req.params.id}`);
                }
            });
        });
    });
});

router.get("/addgame", (req,res) => {
    res.render("games/addgame",{genres:genreList, platforms:platformList});
})

module.exports = router;