var express = require('express');
var app = express();
var coolFaces = require('cool-ascii-faces');
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/public'));
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
  response.send(process.env.DATABASE_URL);

});

app.get('/db', function(request, response) {
	var x = process.env.DATABASE_URL;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table2', function(err, result) {
			done();
			if(err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(x);
			}
		});
	});
});





app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
