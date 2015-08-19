 'use strict';
var express    = require('express'),
		path       = require('path'),
		routes     = require('./app/routes'),
		app        = express(),
		exphbs     = require('express-handlebars'),
		json       = require('express-json'),
		bodyParser = require('body-parser'),
		jwt        = require('jsonwebtoken'),
		unless     = require('express-unless'),
		config     = require('./app/config'),
		bcrypt     = require('bcryptjs');


app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.get('views') + '/layouts'
}));
app.set('view engine', 'handlebars');
app.set('superSecret', config.secret);

//middleware:
app.use(json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//app.use(express.methodOverride());
//app.use(express.cookieParser('some-secret-value-here'));


// static files:
app.use('/', express.static(path.join(__dirname, 'public')));
//app.use('/media', express.static(path.join(__dirname, '/media')));
//app.use('/media', express.static(__dirname + '/media'));

// development only

if ('development' == app.get('env')) {
    app.use(function(err, req, res, next) {
  		console.error(err.stack);
  		res.status(500).send('Something broke!' + err.stack);
		});
}

//routes list:

routes.initialize(app);


//create server:
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

