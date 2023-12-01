
import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes/beer";
import { config } from "dotenv";


config({ path: __dirname + "/.env"} );

let app = express();

var mustacheExpress = require('mustache-express');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//app.use(bodyParser.json({limit:'1mb'}));
app.use( bodyParser.urlencoded( { extended: true, limit: '1mb', parameterLimit: 20, }) );

app.use( express.static( __dirname + '/static' ) );

app.use( router );

router.use( (req, res ) => {
	console.log(req.url);
	res.status(404);
	res.render('404');
});

const port = process.env.PORT || 3000;
app.listen( port , () => {
	console.log("running on %d", port );
});