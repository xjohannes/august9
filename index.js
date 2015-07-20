var express = require('express');
var app = express();
var multer = require('multer');
var pg = require('pg');
var mkdirp = require('mkdirp');
var fs = require('fs');
var query = require('pg-query');
var escape = require('pg-escape');

query.connectionParameters = process.env.DATABASE_URL;
app.set('port', (process.env.PORT || 5000));

// static files:
//app.use(express.static(__dirname + '/public'));
//app.use('/media', express.static(__dirname + '/media'));
// routes
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/upload', function(req, res) {
	res.sendFile(__dirname + '/public/html/upload.html');
});
app.get('/:projectName/', function(req, res) {
	console.log("Entering route /projectName");
	console.log(req.params.projectName);
	query("SELECT projectId FROM project where projectName='" + (req.params.projectName).toLowerCase() 
    	+"';",
    	function(err, rows, result) {	
    		if(err) {
    			console.error(err);
					res.send("Error " + err);
    		} else {
    			console.log("projectid:");
    			console.log(rows[0].projectid);
    			query("SELECT title from Song where projectid =" 
    				+ rows[0].projectid +"", function(err2, rows2, result2) {
    					if(err2) {
			    			console.error(err);
								res.send("Error " + err2);
			    		} else {
			    			console.log(rows2);
			    			res.send(rows2);
			    		}
    				});
    			}
    	});
});
app.post('/upload/:projectName',[ multer(
{ 
	dest: './public/project/', 
	changeDest: function(dest, req, response) {
	  var projectPath = dest + req.params.projectName,
	  stat = null, projectName = req.params.projectName;
	  console.log("project path: " + req.params.projectName);
	  try {
	      stat = fs.statSync(projectPath);
	  } catch(err) {
	      mkdirp(projectPath, function (err) {
    			if (err) { console.error(err); }
    			else { console.log('pow!'); }
				});
	  }
	  if (stat && !stat.isDirectory()) {
	      // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
	      throw new Error('Directory cannot be created because an inode of a different type exists at "'
	       + dest + '"');
	  }
	  return projectPath;
	}
}), 
function(req, res){

    query("SELECT projectId FROM project where projectName='" + (req.params.projectName).toLowerCase() 
    	+"';", 
    	function(err, rows, result) {	
    		if(err) {
    			console.error("err message:");
    			console.error(err);
					res.send("Error " + err);
    		} else {
    			var escapedQuery = escape("INSERT INTO song(title, projectid, "
    			+ "hasProductionStatus, added, serverKey) "
					+ "VALUES(%L," 
						+ rows[0].projectid + ",'"
						+ req.body.productionstatus +"', NOW(), '"
						+ req.files.file.name +"');", req.files.file.originalname);
    			console.log(escapedQuery);
    			console.log("INSERT INTO Song(title, projectid, "
    			+ "hasProductionStatus, added, serverKey) "
					+ "VALUES('"
						+ req.files.file.originalname+"'," 
						+ rows[0].projectid + ",'"
						+ req.body.productionstatus +"', NOW(), '"
						+ req.files.file.name +"');");
    			query(escapedQuery, 
    			
    			function(err2, rows2, result2) {
    				if(err2) {
    					console.error("err2 message:");
    					console.error(err2);
							res.send("Error " + err2);
    				}else {

    					query("SELECT * FROM Song WHERE serverKey ='" + req.files.file.name + "'", function(err3, rows3, result3) {
  							if(err3) {
  								console.error("err3 message:");
  								console.error(err3);
  								console.log("\n");
									res.send("Error " + err3);
  							}else{
  								console.log("Debug!! originalname: " + req.files.file.originalname + " last inserted row: " + rows3[rows3.length-1].title );
  								if((rows3[rows3.length-1].title) == (req.files.file.originalname)) {
  									console.log("The song " + rows3[rows3.length-1].title + " was inserted successfully in the database.");	
  								}else {
  									console.log("The song " + req.files.file.originalname + " could not be inserted in the database.");
  								}
  								
  								res.send(rows3[rows3.length-1]);
  								res.status(204).end();
  							}
							});
    				}
						
					});
    		}
    		
    });
    //pgClient.query("INSERT INTO Song(title, project, "
    //	+ "hasProductionStatus, added, serverKey) "
		//	+ "VALUES(" + req.files.file. + ", 'Songtitle','Electro','mix', '2015-01-01', '23');");
}]);


app.get('/db', function(request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
			done();
			if(err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(result.rows);
			}
		});
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


