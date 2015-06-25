var express = require('express');
var app = express();
//var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// routes
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
