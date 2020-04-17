const express = require('express');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');

app.use(require('./route/landingr'));
app.use(require('./route/game'));
app.use(require('./route/publisher'));
app.use(require('./route/developer'));
app.use(express.static(__dirname + "/public"));

app.listen(port, ()=>{
    console.log("Server is running on port 3000.");
    console.log("localhost:3000/");
});