var multer = require('multer'),
		pg = require('pg'),
		mkdirp = require('mkdirp'),
		fs = require('fs'),
		query = require('pg-query'),
		escape = require('pg-escape');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		

module.exports = {
		saveProject : function (req, res) {
			console.log("DEBUG: SAVING PROJECT");
			
			//Inserting in project
			var escapedQuery = escape("INSERT INTO project(projectName, email)"
								+ "VALUES('" + (req.body.projectName).toLowerCase() + "', '"+ req.body.email +"')" );
			
			query(escapedQuery,
			    	function(err, rows, result) {	
			    		if(err) {
			    			console.error(err);
								res.send("Error 1 " + err);
			    		} else {
			    			query("SELECT * FROM Project WHERE projectName='" + escape(req.body.projectName).toLowerCase() 
			    						+ "'", function(err1, rows1, result1) {
			  							if(err1) {
			  								console.error("err1 message:");
			  								console.error(err1);
			  								console.log("\n");
												res.send("Error " + err1);
			  							}else{
			  								console.log(rows1[0]);
			  								console.log("The project: " + rows1[0].projectname + " was inserted successfully.");	
			  								//Inserting influences
												if(req.body.influence !== "") {
													var escapedQuery = escape("INSERT INTO projectinfluence"
																	+ " VALUES(" + rows1[0].projectid + ", '" + (req.body.influence).toLowerCase() + "')" );
												
													console.log("Escaped query: " + escapedQuery);
													query(escapedQuery,
													    	function(err2, rows2, result2) {	
													    		if(err2) {
													    			console.error(err2);
																		res.send("Error 1 " + err2);
													    		} else {
													    			console.log(rows2);
													    			console.log("Influences added to the database for " + req.body.influence);
													    			//Inserting participation
																		// Insert by showing list of user
																		// req.body.participation == userid
																		if(req.body.participation !== "") {
																			var escapedQuery = escape("INSERT INTO projectparticipation"
																							+ " VALUES(" + rows1[0].projectid +", " + (req.body.participator).toLowerCase() + ", '"
																							+ req.body.participantRole + "')" );
																		
																			console.log("Escaped query1: '" + escapedQuery + "'");
																			query(escapedQuery,
																			    	function(err3, rows3, result3) {	
																			    		if(err3) {
																			    			console.error(err3);
																								res.send("Error 1 " + err3);
																			    		} else {
																			    			console.log(rows3);
																			    			console.log("Participation added to the database for " + rows1[0].projectname);
																			    	}
																			});
																		}
													    	}
													});
													
												}
			  								res.send(rows1[0]);
			  								res.status(204).end();
			  							}
										});
			    			
			    			}
			    	});
			
		},
		getProjects: function(req, res) {
			console.log("DEBUG: GETTING PROJECTS");
			var sql = escape("SELECT * FROM project;");
			query(sql, function(err, rows, result) {
				if(err) {
					console.error(err);
					res.send("Error " + err);
				} else {
					res.send(rows);
					console.log(rows);
				}
			});
		},
		getProject : function(req, res) {
				console.log("DEBUG: GETTING PROJECT Songs");
				var param = req.params.id;
				
				// is param a number or a string?
				if(+param === +param) {
					var sql = escape("SELECT * from Song where projectid =" 
				    + req.params.id + "");

					query(sql, function(err2, rows2, result2) {
				    if(err2) {
							console.error(err);
							res.send("Error " + err2);
						} else {
							var sql2 = escape("SELECT * from Project where id =" 
				    + req.params.id + "");
					
							query(sql2, function(err3, rows3, result3) {
						    if(err3) {
									console.error(err);
									res.send("Error " + err3);
								} else {
									var resObject = {
										id: req.params.id,
										projectName : rows3[0].projectname,
										email: rows3[0].email
									};
									console.log(rows3);
									console.log("get project :::");
									console.log(resObject);
									res.send(resObject);
								}
						  });
						}
				   });


				} else {
					console.log("Could not find a project with id: " + param);
					res.send("Could not find a project with id: " + param);
				}
				
				
		},
		getSong: function(req, res) {
			console.log("DEBUG: GETTING Song: " + req.params.songTitle);

			var sql = escape("SELECT * FROM Song where id='" + req.params.songTitle + "'");//req.body.songid change to when prod

			query(sql, function(err, rows, result) {
				if(err) {
					console.error(err);
					res.send("Error " + err);
				} else {
					console.log(rows);
					res.json(rows);
				}
			});
		},
		uploadSong : [ multer({ 
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
					console.log("DEBUG: SAVING SONG");
					console.log("saving: " + req.params.projectName);
			    query("SELECT id FROM project where projectName='" 
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
				}],
				updateProject: function (req, res) {
					console.log("DEBUG: PUT **** UPDATE");
					res.send({title:"DEBUG: PUT *** UPDATE"});
				}
};
