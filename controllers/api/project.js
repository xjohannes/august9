
var multer = require('multer'),
pg = require('pg'),
mkdirp = require('mkdirp'),
fs = require('fs'),
query = require('pg-query'),
escape = require('pg-escape'),
config = require('../../app/config'),
http   = require('http'),
cloudinary = require('cloudinary');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		cloudinary.config({ 
		  cloud_name: 'hpk8jms0s', 
		  api_key: '149776374978429', 
		  api_secret: 'vwzS7y3u6DJ0OSfBBc1xAvwKOjs' 
		});

		module.exports = Project = {
		// projcts and song
		getAll: function(req, res) {
			'use strict';
			//console.log("DEBUG: GET ALL PROJECTS ORDER BY id");

			var sql = escape("SELECT * FROM Project ORDER BY id");
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
			console.log("DEBUG: GET PROJECT (with songs) id: " + req.params.id);
			var param = req.params.id,
			resultObj = {};

				// is param a number or a string?
				if(+param === +param) {
					//getting all info from project table
					var sql2 = escape("SELECT * from Project where id=" 
						+ req.params.id + "");

					query(sql2, function(err2, rows2, result2) {
						if(err2) {
							console.error("err2: " + err2);
							res.send(err2);
						} else {
							resultObj = rows2[0];
							// getting all songs for the project
							var sql = escape("SELECT * from Song where projectid=" 
								+ req.params.id + " ORDER BY id");

							query(sql, function(err, rows, result) {
								if(err) {
									console.error("Err: " + err);
									res.send("Error " + err);
								} else {
									resultObj['songs'] = rows;

									// getting influences
									Project.selectFromDB(req.params.id, "projectinfluence", function(err, rows) {
										if(err) {
											console.log("could not get influences: " + err);
											res.send(err);
										}	else {
											console.log("getInfluences");
											resultObj['influences'] = rows;
									  	// getting participation
									  	Project.selectFromDB(req.params.id, "projectparticipation", function(err, rows) {
												if(err) {
													console.log("could not get participation: " + err);
													res.send(err);
												}	else {
													resultObj['participation'] = rows;
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
		postQuery: function(req, res, file) {

		},
		post: function(req, res) {
			console.log("POST::::::::::::::");
			
			if(req.body.id) {
				Project.put(req, res);
			} else {
				console.log("DEBUG: POST PROJECT");		
				//Inserting in project
				if(req.body.transloadit) {
					console.log("Server: Project: Post: transloadit");
					// Start downloading form transloadit
					var transloadit = JSON.parse(req.body.transloadit), thumb, stream, stream2;
					http.get(transloadit.results.resize_to_75[0].url, function(response2) {
						stream2 = cloudinary.uploader.upload_stream(function(result) {
					    //console.log(result);
					    
					    query("SELECT id from project where projectname ='" + projectName + "'", function(errProId, rows3) {
					  	if(errProId) {
					  		console.log('Error Getting project id thumb');
					  		console.log(errProId);
					  		res.send('Error Getting project id thumb' + errProId);
					  	} else {
					  		console.log("Getting id from project OK thumb");
					  		Project.updateDB(rows3[0].id, 'project', ['imgthumb'], ["'" + result.url +"'"], function(errImgLarge, rows4) {
					  			if(errImgLarge) {
					  				console.log('Error updating db with thumb img ');
					  				console.log(errImgLarge);
					  				res.send('Error updating db with thumb img ' + errImgLarge);
					  			} else {
					  				console.log("Upload of image thumb to Cloudinary OK");
					  				//res.status(201);
					  			}
					  		});
					  	}
					  });
					  }, { public_id: req.body.title } );
						response2.pipe(stream2);
						//thumb.end();
					});
					http.get(transloadit.results.resize_to_125[0].url, function(response) {
						//Cloudinary setup
					  stream = cloudinary.uploader.upload_stream(function(result) {
					  	var projectName = config.capitalize(req.body.projectname);
						  query("SELECT id from project where projectname ='" + projectName + "'", function(errProId, rows) {
						  	if(errProId) {
						  		console.log('Error Getting project id');
						  		console.log(errProId);
						  		res.send('Error Getting project id ' + errProId);
						  	} else {
						  		console.log("Getting id from project OK. Id: " + rows[0].id);
						  		Project.updateDB(rows[0].id, 'project', ['imglarge', 'imgalt'], ["'" + result.url +"'", "'" + req.body.about + "'"], function(errImgLarge, rows2) {
						  			if(errImgLarge) {
						  				console.log('Error updating db with large img ');
						  				console.log(errImgLarge);
						  				res.send('Error updating db with large img ' + errImgLarge);
						  			} else {
						  				console.log("Upload of large image to Cloudinary OK");
						  				res.status(201);
						  			}
						  		});
						  	}
						  });
					  	/*res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
             		cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));*/
					  }, { public_id: req.body.title } );
						response.pipe(stream);
					});
					//thumb = fs.createWriteStream(dest + "thumb_" + transloadit.results.resize_to_75[0].id + "." + transloadit.results.resize_to_75[0].ext);
					
					// end downloading from transloadit and uploading to cloudinary
					
					console.log("DONE CREATING FILE " + transloadit.results.resize_to_75[0].id);
				} 
				var projectName = config.capitalize(req.body.projectname),
					sql = escape("INSERT INTO project(projectname, email, about)"
							+ "VALUES('" + projectName + "', '"
							+ req.body.email + "', '"+ req.body.about + "')" ),
					resultObj = {};
				
				query(sql,
					function(err, rows, result) {	
						if(err) {
							console.log("first  error");
							console.error(err);
							res.send("Error 1 " + err);
						} else {
							query("SELECT * FROM Project WHERE projectname='" + projectName
								+ "'", function(err1, rows1, result1) {
									if(err1) {
										console.log("err1 message:");
										console.error(err1);
										console.log("\n");
										res.send("Error " + err1);
									}else{
										resultObj = rows1[0];								
										console.log("The project: " + rows1[0].projectname + " was inserted successfully.");	
				  								//Insert influences
				  								if(req.body.influence !== "") {
				  									var sql = escape("INSERT INTO projectinfluence"
				  										+ " VALUES(" + rows1[0].id + ", '" + (req.body.influence).toLowerCase() + "')" );

				  									console.log("Escaped query: " + sql);
				  									query(sql,
				  										function(err2, rows2, result2) {	
				  											if(err2) {
				  												console.log("influence  error");
				  												console.error(err2);
				  												res.send("Error 1 " + err2);
				  											} else {
				  												resultObj.influence = req.body.influence;
				  												
				  												console.log("Influences added to the database for " + req.body.influence);
														    			//Insert participation
																			if(req.body.participator !== "") {
																				var sql = escape("INSERT INTO projectparticipation"
																					+ " VALUES(" + rows1[0].id +", " + req.body.participator + ", '"
																						+ req.body.participatorRole + "')" );

																				query(sql,
																					function(err3, rows3, result3) {	
																						if(err3) {
																							console.log("project participation error");
																							console.error(err3);
																							res.send("Error 1 " + err3);
																						} else {
																							resultObj.participator = req.body.participator;
																							resultObj.participatorRole = req.body.participatorRole;
																							//res.status(201);
																							console.log("Participation added to the database for " + rows1[0].projectname);
																						}
																						console.log("inner function");
																					});
																			} else {
																					//res.status(201);
																			}
																		}
																		console.log("3 th to outer function");
																	});
									}
								}
								console.log("2th to Outer function");
							});
						}
						console.log("Outer function");
				});
			}	
		},
		put: function(req, res) {
			console.log("PUT PROJECT with id: " + req.body.id);
			var propertyNames,
				newValues,
				resultObj= {};
				console.log('req.body.transloadit.results');
				console.log(req.body.transloadit.results);
			// Update project table
			if(req.body.transloadit.results) {
				var transloadit = JSON.parse(req.body.transloadit), thumb, stream, stream2;
				http.get(transloadit.results.resize_to_125[0].url, function(response) {
					//Cloudinary update thumb
				  stream = cloudinary.uploader.upload_stream(function(result) {
				  	var projectName = config.capitalize(req.body.projectname);
					  Project.updateDB(req.body.id, 'project', ['imgthumb'], ["'" + result.url +"'"], function(errImgLarge, rows2) {
			  			if(errImgLarge) {
			  				console.log('Error updating db with large img ');
			  				console.log(errImgLarge);
			  				res.send('Error updating db with large img ' + errImgLarge);
			  			} else {
			  				console.log("Upload of large image to Cloudinary OK");
			  				//res.status(201);
			  			}
					  });
				  	/*res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
           		cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));*/
				  }, { public_id: req.body.title } );
					response.pipe(stream);
				});
				http.get(transloadit.results.resize_to_125[0].url, function(response) {
					//Cloudinary update large img
				  stream = cloudinary.uploader.upload_stream(function(result) {
				  	var projectName = config.capitalize(req.body.projectname);
					  Project.updateDB(req.body.id, 'project', ['imglarge', 'imgalt'], ["'" + result.url +"'", "'" + req.body.about + "'"], function(errImgLarge, rows2) {
			  			if(errImgLarge) {
			  				console.log('Error updating db with large img ');
			  				console.log(errImgLarge);
			  				res.send('Error updating db with large img ' + errImgLarge);
			  			} else {
			  				console.log("Upload of large image to Cloudinary OK");
			  				res.status(201);
			  			}
					  });
				  	/*res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
           		cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));*/
				  }, { public_id: req.body.title } );
					response.pipe(stream);
				});
				
				/*propertyNames = ['projectname', 'email', 'about', 'imglarge', 'imgalt'];
				newValues = ["'" + req.body.projectname + "'", "'" + req.body.email + "'"
											, "'" + req.body.about + "'" , "'" + req.files.file.name + "'" 
											, "'" + req.body.imgalt + "'"];*/
			}
			propertyNames = ['projectname', 'email', 'about',  'imgalt'];
			newValues = ["'" + req.body.projectname + "'", "'" + req.body.email + "'"
										, "'" + req.body.about + "'" , "'" + req.body.imgalt + "'"];
			
			
			Project.updateDB(req.body.id, "project" , propertyNames, newValues, function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Update projectinfluence table
					propertyNames = ['influence'];
					newValues = ["'" + req.body.influence + "'"];
					Project.updateDB(req.body.id, "projectinfluence" , propertyNames, newValues, function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Update projectinfluence table
							propertyNames = ['userid', 'role'];
							newValues = ["'" + req.body.participator + "'", "'" + req.body.participatorRole + "'"];
							Project.updateDB(req.body.id, "projectparticipation" , propertyNames, newValues, function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									res.status(200);
									console.log('update of projectname, email, about and influence OK');
								}
							});
						}
					});
					
				}
			});
			
		},
		delete: function(req, res) {
			var id = req.params.id, dest = './public/media/images/';
			console.log('req.params.id');
			console.log(req.params.id);
			Project.selectFromDB(id, 'project', function(err, rows) {
				console.log("DELETEING img");
							var result;
							if(err) {
								console.log("delete err");
								console.log(err);
							} else {
								console.log("rows");
								console.log(rows[0]);
								Project.deleteFromCloudinary(rows[0]['imglarge']);
								Project.deleteFromCloudinary(rows[0]['imgthumb']);

								/*try {
									fs.unlinkSync(dest + rows[0]['imglarge']);
									fs.unlinkSync(dest + rows[0]['imgthumb']);
								} catch (e) {
									console.log("Could not delete image of projct: " + id);
									console.log(e);
								}*/
							}
						});
			
			// Delete projectinfluence table
			Project.deleteFromDB(id, "projectinfluence", function(err, rows) {
				if(err) {
					console.log(err);
					console.log(err);
					res.send(err);
				} else {
					// Delete projectparticipation table
					Project.deleteFromDB(id, "projectparticipation", function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Delete project table
							Project.deleteFromDB(id, "project", function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									res.status(200).json("Deleted projecet successfully");
									console.log('Deleted project ' + id 
										+ " from project, projectinfluence and projectparticipation tables");
									
								}
							});
						}
					});
					
				}
			});
			
		},
		deleteFromCloudinary: function(imgUrl) {
			var index = imgUrl.lastIndexOf("/") + 1,
					filename = imgUrl.slice(index).replace(/\.[^/.]+$/, "");
					console.log(filename);
					cloudinary.uploader.destroy(filename, function(result) { console.log('cloudinary result:'); console.log(result) });
		},
		// config methods:
		configProjectId: function(table) {
			if(table === "project") {
				return "id";
			} else {
				return "projectid";
			}
		},
		selectFromDB: function(id, table, callback) {

			var sql = escape("SELECT * FROM " + table + " where " + Project.configProjectId(table) + "='" 
				+ id +"'");
			

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
					console.log(table);
					if(table == "project") {

						sql += "id =" + id;
					} else {
						sql += "projectid =" + id;
					}
				}
			}); 
			console.log("SQL: " + sql);

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

			if(table == "project") {
						sql += "id =" + id;
					} else {
						sql += "projectid =" + id;
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
};
