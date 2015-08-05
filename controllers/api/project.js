
var multer = require('multer'),
pg = require('pg'),
mkdirp = require('mkdirp'),
fs = require('fs'),
query = require('pg-query'),
escape = require('pg-escape');

		//configuration
		query.connectionParameters = process.env.DATABASE_URL;
		

		module.exports = Project = {
		// projcts and song
		getAll: function(req, res) {
			'use strict';
			console.log("DEBUG: GET ALL PROJECTS");
			var sql = escape("SELECT * FROM Project "
				+ req.params.projectid + "");
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
			console.log("DEBUG: GET PROJECT (with songs)");
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
								+ req.params.id + "");

							query(sql, function(err, rows, result) {
								if(err) {
									console.error("Err: " + err);
									res.send("Error " + err);
								} else {
									resultObj['songs'] = rows;
									// getting influences
									console.log(Project);
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
					res.send("Could not find a project with id: " + param);
				}
		},
		selectFromDB: function(projectid, callback) {
			console.log("getInfluences");
			var sql = escape("SELECT * FROM projectinfluence where projectid='" 
				+ projectid+"'");

			query(sql, function(err, rows, results) {
				if(err) {
					callback(err);
				} else {
					callback(false, rows);
				}
			});
		},
		selectFromDB: function(id, table, callback) {
			var sql = escape("SELECT * FROM " + table + " where projectid='" 
				+ id+"'");

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
			var sql = escape("INSERT INTO project(projectName, email)"
				+ "VALUES('" + (req.body.projectName).toLowerCase() + "', '"+ req.body.email +"')" ),
			resultObj = {};
			
			query(sql,
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
									resultObj = rows1[0];
									console.log(rows1[0]);
									console.log("The project: " + rows1[0].projectname + " was inserted successfully.");	
			  								//Inserting influences
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
													    			//Inserting participation
																		// Insert by showing list of user
																		// req.body.participation == userid
																		if(req.body.participation !== "") {
																			var sql = escape("INSERT INTO projectparticipation"
																				+ " VALUES(" + rows1[0].id +", " + req.body.participator + ", '"
																					+ req.body.participatorRole + "')" );

																			console.log("Escaped query1: '" + sql + "'");
																			query(sql,
																				function(err3, rows3, result3) {	
																					if(err3) {
																						console.error(err3);
																						res.send("Error 1 " + err3);
																					} else {
																						resultObj.participator = req.body.participator;
																						resultObj.participatorRole = req.body.participatorRole;
																						res.send(rows1[0]);
																						res.status(204).end();
																						console.log(rows3);
																						console.log("Participation added to the database for " + rows1[0].projectname);
																					}
																				});
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

		},
		delete: function(req, res) {

		}
};
