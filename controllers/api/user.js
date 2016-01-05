var multer = require('multer'),
pg         = require('pg'),
mkdirp     = require('mkdirp'),
fs         = require('fs'),
query      = require('pg-query'),
escape     = require('pg-escape'),
config     = require('../../app/config'),
jwt        = require('jsonwebtoken'),
bcrypt     = require('bcryptjs');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		
		module.exports = User = {
		// Users
		getAll: function(req, res) {
			'use strict';
			//console.log("DEBUG: GET ALL USERS ORDER BY id");

			var sql = escape("SELECT * FROM usertable ORDER BY regdate");
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
		get: function(req, res) {
			console.log("DEBUG: GET SONG (with comments) id: " + req.params.id);
			
			var param = req.params.id,
			resultObj = {};

				// is param a number or a string?
				if(+param === +param) {
					//getting all info from project table
					/*
					var sql2 = escape("SELECT * from User, songcomment," 
						+ "songinfluence, songparticipation "
						+ "WHERE song.id = songcomment.songid "
						+ "AND song.id = songinfluence.songid " 
						+ "AND song.id = songparticipation.songid " 
						+ "  AND song.id =" + req.params.id + "");

*/
					console.log("req.params.id");
					console.log(req.params.id);
					var sql2 = escape("SELECT * FROM user s "
						+ " WHERE s.id =" + req.params.id + "");

					query(sql2, function(err2, rows2, result2) {
						if(err2) {
							console.error("err2: " + err2);
							res.send(err2);
						} else {
							//console.log(result2);
							resultObj = rows2[0];

							// getting all comments for the user
							
							var sql = escape("SELECT * from Usercomment where userid =" 
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
									
									User.selectFromDB(req.params.id, "userinfluence", function(err, rows) {
										if(err) {
											console.log("could not get influences: " + err);
											res.send(err);
										}	else {
											if(rows.length !== 0) {
												resultObj['influence'] = rows[0].influence;
											}
									  	// getting participation
									  	User.selectFromDB(req.params.id, "userparticipation", function(err, rows) {
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
				dest: './public/media/avatar/',
				
				changeDest: function(dest, req, response) {
				  var username = req.body.username.toLowerCase(),
				  		userPath = dest + username,
				  		stat = null;
				  console.log("user path: " + req.body.username.toLowerCase() + " *** " + userPath);
				  try {
				      stat = fs.statSync(userPath);
				  } catch(err) {
				      mkdirp(userPath, function (err) {
			    			if (err) { console.error(err); }
			    			else { console.log('pow!'); }
							});
				  }
				  if (stat && !stat.isDirectory()) {
				      // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
				      throw new Error('Directory cannot be created because an inode of a different type exists at "'
				       + dest + '"');
				  }
				  return userPath;
				}
			}), 

			function(req, res){
					console.log("DEBUG: SAVING USER");
					
			    if(req.files.file !== undefined) {
			    	var escapedQuery = escape("INSERT INTO usertable(username, firstname, lastname,"
	    			+ "email, regdate, password) "
						+ "VALUES(%L," 
							+ req.params.id + ",'"
							+ req.body.username.toLowerCase() + ",'"
							+ config.capitalize(req.body.firstname) + ",'"
							+ config.capitalize(req.body.lastname)+ ",'"
							+ req.body.email + ",'"
							+"', NOW(), '"
							+ User.encryptPassword(req.body.password) + ",'"),
							
							resultObj = {};
	    			
	    			query(escapedQuery, 
	    			
	    			function(err2, rows2, result2) {
	    				if(err2) {
	    					console.error("err2 message:");
	    					console.error(err2);
								res.send("Error " + err2);
	    				}else {
	    					// table, valuesArray, callback	    					
	    					query("SELECT * FROM Usertable WHERE username ='" + req.body.username.toLowerCase() 
	    						+ "'", function(err3, rows3, result3) {
	  							if(err3) {
	  								console.error("err3 message:");
	  								console.error(err3);
	  								console.log("\n");
										res.send("Error " + err3);
	  							}else{
	  								resultObj = rows3[0];
	  								if(rows3[0].username == req.body.name.toLowerCase()) {
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
		  													res.status(201);
				  										}
	  												});
	  											} else {
		  											res.status(201);
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

			// Update user table
			if(req.body.notes !== '') {
				propertyNames = ['title', 'hasproductionstatus', 'notes'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"
											, "'" + req.body.notes + "'"];
			} else {
				propertyNames = ['title', 'hasproductionstatus'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"];
			}
			
			User.updateDB(req.body.id, "user" , propertyNames, newValues, function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Update userinfluence table
					propertyNames = ['influence'];
					newValues = ["'" + req.body.influence + "'"];
					User.updateDB(req.body.id, "userinfluence" , propertyNames, newValues, function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Update userparticipation table
							propertyNames = ['userid', 'role'];
							newValues = ["'" + req.body.participator + "'", "'" + req.body.participatorRole + "'"];
							User.updateDB(req.body.id, "userparticipation" , propertyNames, newValues, function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									res.status(200).json("The user "+ + req.body.title + " was updated successfully");
									console.log('update of username, email, about and influence OK');
									
								}
							});
						}
					});
					
				}
			});
			
		},
		delete: function(req, res) {
			console.log("DELETE SONG " + req.body.serverkey);
			// Delete userinfluence table
			User.deleteFromDB(req.params.id, "userinfluence", function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Delete userparticipation table
					User.deleteFromDB(req.params.id, "userparticipation", function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Delete commentcomment table
							User.deleteFromDB(req.params.id, "commentcomment", function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									// Delete usercomment table
									User.deleteFromDB(req.params.id, "usercomment", function(err, rows) {
										if(err) {
											console.log(err);
											res.send(err);
										} else {
											// Delete user table
											User.selectFromDB(req.params.id, "user", function(err, rows) {
												if(err) {
													console.log(err);
												} else {
													console.log(rows[0]);
													var serverkey = rows[0].serverkey;
													User.deleteFromDB(req.params.id, "user", function(err, rows) {
														if(err) {
															console.log(err);
															res.send(err);
														} else {
															res.status(200).json('Successfully deleted user ' + req.body.title);
															var userUrl = './public/media/music/' + serverkey;
															fs.unlinkSync(userUrl);
															console.log('Deleted user ' + req.params.id 
																+ " from user, userinfluence and songparticipation tables");
															
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
			if(table === 'user') {
				sql += "id= " + id + "";
			} else {
				sql += "userid=" + id + ""; 
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
		},
		//id, table, columnsArray, newValuesArray, callback
		encryptPassword: function(pass) {
			
			var salt = bcrypt.genSaltSync(10),
					hash = bcrypt.hashSync(pass, salt);

			return hash;
			//"Vidar38"

			/*
			User.updateDB(1, 'usertable', ['password'], ["'" + hash + "'"], function(err, rows) {
				if(err) {
					console.log(err);
				} else {
					if(bcrypt.compareSync("123qweASD", hash)) {
						console.log("The password was set ok");
						return true;
					} else {
						console.log("The password Did not match");
						return fals;
					}
				}
			});
			*/
		},
		authenticate: function(req, res) {
			console.log("Authenticate: " + req.body.username);
			if(req.body.username && req.body.password) {
				var sql = escape("SELECT password FROM usertable where username='" + req.body.username +"'");
				query(sql, function(err, rows, results) {
					if(err) {
						console.log(err)
					} else {
						console.log(rows[0]);
						bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
							if(err) {
								console.log(err);
							} else {
								if(result){
									console.log("Authenticate success. Create token");
									var token = jwt.sign({username: req.body.username}, config.secret, {
										expiresInMinutes: 1440 // expires in 24 hours
									});
									res.status(200).json({
										success: true,
										token: token
									});
									//res.status(200).json();
								} else {
									console.log("Authenticate Failed. Redirect to index");
								}
							}
						});
					}
				});
			} else {
				res.status(400).json('no username or password');
			}
			
		}

};
