var multer = require('multer'),
		pg = require('pg'),
		mkdirp = require('mkdirp'),
		fs = require('fs'),
		query = require('pg-query'),
		escape = require('pg-escape');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;

module.exports = {
		getProject : function(req, res) {
				//console.log("Entering route /projectName");
				console.log(req.params.projectName);
				query("SELECT projectId FROM project where projectName='" 
						+ (req.params.projectName).toLowerCase() 
			    	+"';",
			    	function(err, rows, result) {	
			    		if(err) {
			    			console.error(err);
								res.send("Error " + err);
			    		} else {
			    			//console.log("projectid:");
			    			//console.log(rows[0].projectid);
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
		},
		upploadSong : [ multer({ 
			//multer configuration:
				dest: '../media/music/', 
				changeDest: function(dest, req, response) {
				  var projectPath = dest + req.params.projectName,
				  stat = null, projectName = req.params.projectName;
				  //console.log("project path: " + req.params.projectName);
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
			    query("SELECT projectId FROM project where projectName='" 
			    	+ (req.params.projectName).toLowerCase() 
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
			    			
			    			query(escapedQuery, 
			    			
			    			function(err2, rows2, result2) {
			    				if(err2) {
			    					console.error("err2 message:");
			    					console.error(err2);
										res.send("Error " + err2);
			    				}else {

			    					query("SELECT * FROM Song WHERE serverKey ='" + req.files.file.name 
			    						+ "'", function(err3, rows3, result3) {
			  							if(err3) {
			  								console.error("err3 message:");
			  								console.error(err3);
			  								console.log("\n");
												res.send("Error " + err3);
			  							}else{
			  								//console.log("Debug!! originalname: " 
			  								//+ req.files.file.originalname + " last inserted row: " 
			  								//+ rows3[rows3.length-1].title );
			  								if((rows3[rows3.length-1].title) == (req.files.file.originalname)) {
			  									console.log("The song " + rows3[rows3.length-1].title 
			  										+ " was inserted successfully in the database.");	
			  								}else {
			  									console.log("The song " + req.files.file.originalname 
			  										+ " could not be inserted in the database.");
			  								}
			  								
			  								res.send(rows3[rows3.length-1]);
			  								res.status(204).end();
			  							}
										});
			    				}	
								});
			    		}	
			    });
				}]
};
