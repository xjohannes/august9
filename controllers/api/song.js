var multer = require('multer'),
pg = require('pg'),
mkdirp = require('mkdirp'),
fs = require('fs'),
query = require('pg-query'),
escape = require('pg-escape');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		
		module.exports = Song = {
		get: function(req, res) {
			console.log("DEBUG: GET SONG (with comments)");
			
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
							console.log(result2);
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
											console.log("getInfluences");
											resultObj['influences'] = rows;
									  	// getting participation
									  	Song.selectFromDB(req.params.id, "songparticipation", function(err, rows) {
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
					res.send("Could not find a project with id: " + param);
				}
		},
		selectFromDB: function(id, table, callback) {
			var sql = escape("SELECT * FROM " + table + " where songid='" 
				+ id+"'");

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
		post : [ multer({ 
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
					console.log("saving: " + req.params.projectid);
			    
    			var escapedQuery = escape("INSERT INTO song(title, projectid, "
    			+ "hasProductionStatus, added, serverKey) "
					+ "VALUES(%L," 
						+ req.params.projectid + ",'"
						+ req.body.productionstatus +"', NOW(), '"
						+ req.files.file.name +"');", req.files.file.originalname),
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
    							console.log("RESULT OBJECT:");
    							console.log(resultObj);
  								//console.log("Debug!! originalname: " 
  								//+ req.files.file.originalname + " last inserted row: " 
  								//+ rows3[rows3.length-1].title );
  								if((rows3[0].title) == (req.files.file.originalname)) {
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
		  											console.log(resultObj);
		  											res.send(resultObj);
  													res.status(204).end();
		  										}
  											});
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
				}],
		put: function(req, res) {

		},
		delete: function(req, res) {

		},
};
