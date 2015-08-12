var multer = require('multer'),
pg = require('pg'),
mkdirp = require('mkdirp'),
fs = require('fs'),
query = require('pg-query'),
escape = require('pg-escape'),
config = require('../../app/config');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		
		module.exports = Song = {
		get: function(req, res) {
			console.log("DEBUG: GET SONG (with comments) id: " + req.params.id);
			
			var param = req.params.id,
			resultObj = {};

				// is param a number or a string?
				if(+param === +param) {
					//getting all info from project table
					/*
					var sql2 = escape("SELECT * from Song, songcomment," 
						+ "songinfluence, songparticipation "
						+ "WHERE song.id = songcomment.songid "
						+ "AND song.id = songinfluence.songid " 
						+ "AND song.id = songparticipation.songid " 
						+ "  AND song.id =" + req.params.id + "");

*/
					console.log("req.params.id");
					console.log(req.params.id);
					var sql2 = escape("SELECT * FROM song s "
						+ " WHERE s.id =" + req.params.id + "");

					query(sql2, function(err2, rows2, result2) {
						if(err2) {
							console.error("err2: " + err2);
							res.send(err2);
						} else {
							//console.log(result2);
							resultObj = rows2[0];

							// getting all comments for the song
							
							var sql = escape("SELECT * from Songcomment where songid =" 
								+ req.params.id + "");

							query(sql, function(err, rows, result) {
								if(err) {
									console.error("Err: " + err);
									res.send("Error " + err);
								} else {

									resultObj['comments'] = rows;
									console.log("comments:");
									console.log(rows);
									// getting influences
									
									Song.selectFromDB(req.params.id, "songinfluence", function(err, rows) {
										if(err) {
											console.log("could not get influences: " + err);
											res.send(err);
										}	else {
											if(rows.length !== 0) {
												resultObj['influence'] = rows[0].influence;
											}
									  	// getting participation
									  	Song.selectFromDB(req.params.id, "songparticipation", function(err, rows) {
												if(err) {
													console.log("could not get participation: " + err);
													res.send(err);
												}	else {
													console.log("getParticipation");
													if(rows.length !== 0) {
														resultObj['participation'] = rows[0];
													}
											  	res.send(resultObj);
											  	
												}	
											});
										}	
									});
								}
							});
						} 
					});
				} else {
					console.log("Could not find a project with id: " + param);
					res.status(404).json("Could not find a project with id: " + param);
				}
		},
		post : [ multer({ 
			//multer configuration:
				dest: './public/media/music/',
				/*
				changeDest: function(dest, req, response) {
				  var projectPath = dest + req.body.projectname.toLowerCase().replace(/\s+/g, ''),
				  stat = null, projectname = req.body.projectname;
				  console.log("project path: " + req.body.projectname + " *** " + projectPath);
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
				*/
			}), 

			function(req, res){
					console.log("DEBUG: SAVING SONG");
			    if(req.files.file !== undefined) {
			    	var escapedQuery = escape("INSERT INTO song(title, projectid, "
	    			+ "hasProductionStatus, added, serverKey) "
						+ "VALUES(%L," 
							+ req.params.projectid + ",'"
							+ (req.body.productionstatus).toLowerCase() +"', NOW(), '"
							+ req.files.file.name +"');", config.normalize(req.files.file.originalname)),
	    			resultObj = {};
	    			
	    			query(escapedQuery, 
	    			
	    			function(err2, rows2, result2) {
	    				if(err2) {
	    					console.error("err2 message:");
	    					console.error(err2);
								res.send("Error " + err2);
	    				}else {
	    					// table, valuesArray, callback	    					
	    					query("SELECT * FROM Song WHERE serverKey ='" + req.files.file.name 
	    						+ "'", function(err3, rows3, result3) {
	  							if(err3) {
	  								console.error("err3 message:");
	  								console.error(err3);
	  								console.log("\n");
										res.send("Error " + err3);
	  							}else{
	  								resultObj = rows3[0];
	  								if((rows3[0].title) == config.normalize(req.files.file.originalname)) {
	  									Song.insertIntoDB("songinfluence"
	  										, [rows3[0].id, "'"+ req.body.influence+"'"]
	  										, function(err, rows) {
	  										//console.log("insert song influence");
	  										if(err) {
	  											console.error("err message:");
				  								console.error(err);
				  								console.log("\n");
													res.send(err);
	  										} else {
	  											resultObj.influence = req.body.influence;
	  											if(req.body.participator !== undefined) {
	  												Song.insertIntoDB("songparticipation"
	  												, [rows3[0].id,  req.body.participator, "'"+ req.body.participatorRole+"'"]
	  												, function(err, rows) {
			  										//console.log("insert song participation");
				  										if(err) {
				  											console.error("err message:");
							  								console.error(err);
							  								console.log("\n");
																res.send("Error " + err);
				  										} else {
				  											resultObj.participator = req.body.participator;
				  											resultObj.participatorRole = req.body.participatorRole;			  											  											
		  													res.status(201).json(resultObj);
				  										}
	  												});
	  											} else {
		  											res.status(201).json(resultObj);
	  											}
	  										}
	  									});
	  									console.log("The song " + rows3[rows3.length-1].title 
	  										+ " was inserted successfully in the database.");	
	  								}else {
	  									console.log("The song " + req.files.file.originalname 
	  										+ " could not be inserted in the database.");
	  								}
	  							}
								});
    					}	
						});
			    } else {
			    	res.status(400).json("No file attached. Remember to add a file.");
			    }
    			
				}],
		put: function(req, res) {
			console.log("DEBUG: PUT SONG");
			var propertyNames,
				newValues,
				resultObj= {};

			// Update song table
			if(req.body.notes !== '') {
				propertyNames = ['title', 'hasproductionstatus', 'notes'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"
											, "'" + req.body.notes + "'"];
			} else {
				propertyNames = ['title', 'hasproductionstatus'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"];
			}
			
			Song.updateDB(req.body.id, "song" , propertyNames, newValues, function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Update songinfluence table
					propertyNames = ['influence'];
					newValues = ["'" + req.body.influence + "'"];
					Song.updateDB(req.body.id, "songinfluence" , propertyNames, newValues, function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Update songparticipation table
							propertyNames = ['userid', 'role'];
							newValues = ["'" + req.body.participator + "'", "'" + req.body.participatorRole + "'"];
							Song.updateDB(req.body.id, "songparticipation" , propertyNames, newValues, function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									res.status(200).json("The song "+ + req.body.title + " was updated successfully");
									console.log('update of songname, email, about and influence OK');
									
								}
							});
						}
					});
					
				}
			});
			
		},
		delete: function(req, res) {
			console.log("DELETE SONG " + req.body.serverkey);
			// Delete songinfluence table
			Song.deleteFromDB(req.params.id, "songinfluence", function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Delete songparticipation table
					Song.deleteFromDB(req.params.id, "songparticipation", function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Delete commentcomment table
							Song.deleteFromDB(req.params.id, "commentcomment", function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									// Delete songcomment table
									Song.deleteFromDB(req.params.id, "songcomment", function(err, rows) {
										if(err) {
											console.log(err);
											res.send(err);
										} else {
											// Delete song table
											Song.selectFromDB(req.params.id, "song", function(err, rows) {
												if(err) {
													console.log(err);
												} else {
													console.log(rows[0]);
													var serverkey = rows[0].serverkey;
													Song.deleteFromDB(req.params.id, "song", function(err, rows) {
														if(err) {
															console.log(err);
															res.send(err);
														} else {
															res.status(200).json('Successfully deleted song ' + req.body.title);
															var songUrl = './public/media/music/' + serverkey;
															fs.unlinkSync(songUrl);
															console.log('Deleted song ' + req.params.id 
																+ " from song, songinfluence and songparticipation tables");
															
														}
													});
												}
											});
											
											
										}
									});
									
								}
							});
						}
					});
					
				}
			});
		},
		// config methods:
		selectFromDB: function(id, table, callback) {
			var sql = escape("SELECT * FROM " + table + " where "); 
			if(table === 'song') {
				sql += "id= " + id + "";
			} else {
				sql += "songid=" + id + ""; 
			}
			console.log(sql);
			query(sql, function(err, rows, results) {
				if(err) {
					callback(err);
				} else {
					callback(false, rows);
				}
			});
		},
		insertIntoDB: function(table, valuesArray, callback) {
			var sql = escape("INSERT INTO " + table + " VALUES(");
			valuesArray.forEach(function(currentValue, index, array) {
				if(index < (valuesArray.length -1)) {
					sql += currentValue + ",";
				} else {
					sql += currentValue + ")";
				}
			});
			console.log(table + " - ");
			console.log(sql);
			query(sql, function(err, rows, results) {
				if(err) {
					callback(err);
				} else {
					callback(false, rows);
				}
			});
		},
		updateDB: function(id, table, columnsArray, newValuesArray, callback) {
			var sql = escape("UPDATE " + table + " SET "); 
			columnsArray.forEach(function(currentValue, index) {
				if(index < (columnsArray.length -1)) {
					sql += currentValue + "=" + newValuesArray[index] + ",";
				} else {
					sql += currentValue + "=" + newValuesArray[index];
					sql += " WHERE ";
					console.log("Table: " + table);
					if(table == "song") {
						sql += "id =" + id;
					} else {
						sql += "songid =" + id;
					}
				}
			}); 
			//console.log("DEBUG: SQLl: " + sql);

			query(sql, function(err, rows, results) {
				if(err) {
					callback(err);
				} else {
					callback(false, rows);
				}
			});
		},
		deleteFromDB: function(id, table, callback) {
			var sql = escape("DELETE FROM " + table + " WHERE "); 

			if(table == "song") {
						sql += "id =" + id;
					} else {
						sql += "songid =" + id;
					}
			
			//console.log("SQL: " + sql);

			query(sql, function(err, rows, results) {
				if(err) {
					callback(err);
				} else {
					callback(false, rows);
				}
			});
		},
		play: function (req, res) {
			console.log("PLAY");
			res.status(204).end();
		}
};
