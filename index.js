var express = require('express');
var app = express();
var coolFaces = require('cool-ascii-faces');
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	var result = '';
	var times = process.env.TIMES || 5;
	for( var i = 0; i < times; i++) {
		result += coolFaces();
	}
  response.send(result);
});

app.get('/db', function( request, response ) {
	pg.connect(process.env.DATABASEURL, function( err, result ) {
		if(err) {
			console.error(err);
			response.send("Error " + err);
		}
		else {
			response.send(result.rows);
		}
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
