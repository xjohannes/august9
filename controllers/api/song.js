var multer = require('multer'),
pg         = require('pg'),
mkdirp     = require('mkdirp'),
fs         = require('fs'),
query      = require('pg-query'),
escape     = require('pg-escape'),
config     = require('../../app/config'),
jwt        = require('jsonwebtoken'),
bcrypt     = require('bcryptjs'),
cloudinary = require('cloudinary');

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
											  	res.status(200).send(resultObj);
											  	
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
		postToDb: function(req, res) {
			var escapedQuery = escape("INSERT INTO song(title, projectid, "
	    			+ "hasProductionStatus, added, serverKey) "
						+ "VALUES(%L," 
							+ req.params.projectid + ",'"
							+ (req.body.productionstatus).toLowerCase() +"', NOW(), '"
							+ req.result.url +"');", config.capitalize(req.files.file.originalname)),
	    			resultObj = {};
	    			
	    			query(escapedQuery, 
	    			
	    			function(err2, rows2, result2) {
	    				if(err2) {
	    					console.error("err2 message:");
	    					console.error(err2);
								res.end("Error " + err2);
	    				} else {
	    					// table, valuesArray, callback	    					
	    					query("SELECT * FROM Song WHERE serverKey ='" + req.result.url
	    						+ "'", function(err3, rows3, result3) {
	  							if(err3) {
	  								console.error("err3 message:");
	  								console.error(err3);
	  								console.log("\n");
										res.end("Error " + err3);
	  							}else{
	  								resultObj = rows3[0];
	  								if((rows3[0].title) == config.capitalize(req.files.file.originalname)) {
	  									Song.insertIntoDB("songinfluence"
	  										, [rows3[0].id, "'"+ req.body.influence+"'"]
	  										, function(err, rows) {
	  										//console.log("insert song influence");
	  										if(err) {
	  											console.error("err message:");
				  								console.error(err);
				  								console.log("\n");
													res.end(err);
	  										} else {
	  											console.log("inserted influence " + req.body.influence + " successfully");
	  											resultObj.influence = req.body.influence;
	  											if(req.body.participator !== undefined && req.body.participatorRole) {
	  												Song.insertIntoDB("songparticipation"
	  												, [rows3[0].id,  req.body.participator, "'"+ req.body.participatorRole+"'"]
	  												, function(err, rows) {
			  										//console.log("insert song participation");
				  										if(err) {
				  											console.error("err message:");
							  								console.error(err);
							  								console.log("\n");
																res.end("Error 4 " + err);
				  										} else if(req.body.participator !== "") {
				  											console.log("inserted participator " + req.body.participator + " successfully")
				  											resultObj.participator = req.body.participator;
				  											resultObj.participatorRole = req.body.participatorRole;			  											  											
		  													res.status(201).end('<div id="serverResponse">'
																			+ ' <p>Edit successfull</p>'
																			+ ' <button>Back to site</button>'
																			+ ' </div>');
				  										} else {
				  											res.status(201).end('<div id="serverResponse">'
																			+ ' <p>Edit successfull</p>'
																			+ ' <button>Back to site</button>'
																			+ ' </div>');
				  										}
	  												});
	  											} else {
		  											res.status(201).end('<div id="serverResponse">'
																			+ ' <p>Edit successfull</p>'
																			+ ' <button>Back to site</button>'
																			+ ' </div>');
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
		},
		post : [ multer({ 
			//multer configuration:
				dest: './public/media/music/'
			}), 

			function(req, res){
					console.log("DEBUG: SAVING SONG");
					console.log(req.body);
			    if(req.files.file !== undefined) {
			    	var cloudinaryStream, readStream = fs.createReadStream('./public/media/music/' + req.files.file.name);
			    	cloudinaryStream = cloudinary.uploader.upload_stream(function(result) {
					    console.log('cloudinary result url');
					    console.log(result.url);
					    req['result']= result;
					    Song.postToDb(req, res);
					    // Delete from heroku after upload to cloudinary
					    var songUrl = './public/media/music/' + req.files.file.name;
															fs.unlinkSync(songUrl);
															console.log('Deleted song ' + req.params.id 
																+ " from song, songinfluence and songparticipation tables");
					  	}, {  resource_type: 'raw' } );
			    	readStream.pipe(cloudinaryStream);
			    } else {
			    	res.status(400).json("No file attached. Remember to add a file.");
			    }
    			
				}],
		put: function(req, res) {
			console.log("DEBUG: PUT SONG");
			var propertyNames,
				newValues,
				resultObj= {};
			console.log(req.body);
			propertyNames = ['title','chorustime', 'hasproductionstatus', 'created', 'notes']; //'participator',
			newValues = ["'" + req.body.title + "'", "'" + req.body.chorustime + "'", "'" + req.body.productionstatus + "'"
				,  "'" + (req.body.created !== ''? req.body.created : new Date()) +"'" , "'" + req.body.notes + "'"]; //"'" + req.body.participator + "'",
			// Update song table
			/*if(req.body.notes !== '') {
				propertyNames = ['title', 'hasproductionstatus', 'notes'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"
											, "'" + req.body.notes + "'"];
			} else {
				propertyNames = ['title', 'hasproductionstatus'];
				newValues = ["'" + req.body.title + "'", "'" + req.body.productionstatus + "'"];
			}*/

			Song.updateDB(req.body.id, "song" , propertyNames, newValues, function(err, rows) {
				if(err) {
					console.log("ERR: song");
					console.log(err);
					res.end(err);
				} else {
					// Update songinfluence table
					propertyNames = ['influence'];
					newValues = ["'" + req.body.influence + "'"];
					Song.updateDB(req.body.id, "songinfluence" , propertyNames, newValues, function(err, rows) {
						if(err) {
							console.log("ERR: influence");
							console.log(err);
							res.end(err);
						} else {
							// Update songparticipation tabl
						
							propertyNames = ['userid', 'role'];
							newValues = ["'" + req.body.participator + "'", "'" + req.body.participatorRole + "'"];
							Song.updateDB(req.body.id, "songparticipation" , propertyNames, newValues, function(err, rows) {
								if(err) {
									console.log("ERR: songparticipation");

									console.log(err);
									res.end(err);
								} else {

									res.status(201).end('<div id="serverResponse">'
																			+ ' <p>Edit successfull</p>'
																			+ ' <button>Back to site</button>'
																			+ ' </div>');
									console.log('update of songname, email, about and influence OK');
									
								}
							});
						}
					});
					
				}
			});
			
		},
		delete: function(req, res) {
			console.log("DELETE SONG " + req.body.projectname);
			console.log(req.body);
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
													var projectid = rows[0].projectid;
													Song.deleteFromDB(req.params.id, "song", function(err, rows) {
														if(err) {
															console.log(err);
															res.send(err);
														} else {
															Song.deleteFromCloudinary(serverkey);
															res.status(200).json('Successfully deleted song ' + req.body.title);
															/*var songUrl = './public/media/music/' + projectid + '/' + serverkey;
															fs.unlinkSync(songUrl);*/
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
		deleteFromCloudinary: function(imgUrl) {
			var index = imgUrl.lastIndexOf("/") + 1,
					filename = imgUrl.slice(index).replace(/\.[^/.]+$/, "");
					console.log('filename');
					console.log(filename);
					cloudinary.uploader.destroy(filename, function(result) { console.log('cloudinary result:'); console.log(result) });
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
