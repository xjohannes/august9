
var multer = require('multer'),
pg = require('pg'),
mkdirp = require('mkdirp'),
fs = require('fs'),
query = require('pg-query'),
escape = require('pg-escape'),
config = require('../../app/config');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		

		module.exports = Project = {
		// projcts and song
		getAll: function(req, res) {
			'use strict';
			console.log("DEBUG: GET ALL PROJECTS ORDER BY id");

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
					var sql2 = escape("SELECT * from Project where id =" 
						+ req.params.id + "");

					query(sql2, function(err2, rows2, result2) {
						if(err2) {
							console.error("err2: " + err2);
							res.send(err2);
						} else {
							resultObj = rows2[0];
							// getting all songs for the project
							var sql = escape("SELECT * from Song where projectid =" 
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
		
		post: function(req, res) {
			console.log("DEBUG: POST PROJECT");		
			//Inserting in project
			var projectName = config.normalize(req.body.projectname),
					sql = escape("INSERT INTO project(projectname, email, about)"
				+ "VALUES('" + projectName + "', '"
					+ req.body.email + "', '"+ req.body.about +"')" ),
			resultObj = {};
			
			query(sql,
				function(err, rows, result) {	
					if(err) {
						console.error(err);
						res.send("Error 1 " + err);
					} else {
						query("SELECT * FROM Project WHERE projectname='" + projectName
							+ "'", function(err1, rows1, result1) {
								if(err1) {
									console.error("err1 message:");
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
			  												console.error(err2);
			  												res.send("Error 1 " + err2);
			  											} else {
			  												resultObj.influence = req.body.influence;
			  												
			  												console.log("Influences added to the database for " + req.body.influence);
													    			//Insert participation
																		if(req.body.participation !== "") {
																			var sql = escape("INSERT INTO projectparticipation"
																				+ " VALUES(" + rows1[0].id +", " + req.body.participator + ", '"
																					+ req.body.participatorRole + "')" );

																			query(sql,
																				function(err3, rows3, result3) {	
																					if(err3) {
																						console.error(err3);
																						res.send("Error 1 " + err3);
																					} else {
																						resultObj.participator = req.body.participator;
																						resultObj.participatorRole = req.body.participatorRole;
																						res.status(201).json(resultObj);
																						console.log("Participation added to the database for " + rows1[0].projectname);
																					}
																				});
																		} else {
																				res.status(201).json(resultObj);
																		}
																	}
																});
								}
							}
						});

					}
			});
		},
		put: function(req, res) {
			console.log("PUT PROJECT with id: " + req.body.id);
			var propertyNames,
				newValues,
				resultObj= {};

			// Update project table
			propertyNames = ['projectname', 'email', 'about'];
			newValues = ["'" + req.body.projectname + "'", "'" + req.body.email + "'"
											, "'" + req.body.about + "'"];
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
									res.status(200).json("The project was updeted successfully");
									console.log('update of projectname, email, about and influence OK');
								}
							});
						}
					});
					
				}
			});
			
		},
		delete: function(req, res) {
			// Delete projectinfluence table
			Project.deleteFromDB(req.params.id, "projectinfluence", function(err, rows) {
				if(err) {
					console.log(err);
					res.send(err);
				} else {
					// Delete projectparticipation table
					Project.deleteFromDB(req.params.id, "projectparticipation", function(err, rows) {
						if(err) {
							console.log(err);
							res.send(err);
						} else {
							// Delete project table
							Project.deleteFromDB(req.params.id, "project", function(err, rows) {
								if(err) {
									console.log(err);
									res.send(err);
								} else {
									res.status(200).json("Deleted projecet successfully");
									console.log('Deleted project ' + req.params.id 
										+ " from project, projectinfluence and projectparticipation tables");
									
								}
							});
						}
					});
					
				}
			});
		},
		// config methods:
		selectFromDB: function(id, table, callback) {
			var sql = escape("SELECT * FROM " + table + " where projectid='" 
				+ id +"'");

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
