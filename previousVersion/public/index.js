var express = require('express');
var app = express();
var router = express.Router();
var util = require("util");

var pg = require('pg');
var multer = require('multer');
var fs = require("fs"); 
//var uploads = require('./server/routes/uploads');

app.set('port', (process.env.PORT || 5000));
app.use(multer({
	dest: "./public/media/uploads/"
}));
app.use(express.static(__dirname + '/public'));


//app.use(“/uploads”, uploads);
//app.use('/media', express.static(__dirname + '/media'));


// static files:
/*
app.configure(function(){
  
  
});
*/
// routes


app.get('/', function(request, response) {
	var result = '';
	var times = process.env.TIMES || 5;
	for( var i = 0; i < times; i++) {
		result += coolFaces();
	}
  response.send(result);
});



app.get('/test', function( request, response ) {
	response.send({
		"testing":"test",
		'test2': 'tesg'
	});
});
/*
app.get('/upload', function(req, res) { 
  res.render("uploadPage", {title: "I love files!"}); 
  
  console.log("upload page");
  
}); 
*/

app.post('/upload', function( req, res, next ) {

	if( req.files) {
		console.log("util: " + util.inspect(req.files));

		if (req.files.track.size === 0 ) {
			return next( new Error("No file selected") );
		}

		fs.exists(req.files.track.path, function ( exists ) {
			if(exists) {
				res.end('Got the file: ' + req.files.track.path);
			}
			else {
				res.end("File upload did not succeed");
			}
		});	

	}
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

