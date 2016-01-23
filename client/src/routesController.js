var Backbone     					= require('Backbone'),
		$            					= require('jQuery'),
		UserModel 						= require('./models/userModel'),
		UserCollection 				= require('./collections/userCollection'),
		UserCollectionView    = require('./views/collectionViews/userCollectionView'),
		UserListItemView   		= require('./views/collectionViews/userListItemView'),
		ProjectModel 					= require('./models/projectModel'),
		ProjectCollection 		= require('./collections/projectCollection'),
		ProjectCollectionView = require('./views/collectionViews/projectCollectionView'),
		ProjectListItemView   = require('./views/collectionViews/projectListItemView'),
		HomeCollectionView    = require('./views/collectionViews/homeCollectionView'),
		
		ProjectForm           = require('./views/formViews/projectForm'),
		ProjectEditForm       = require('./views/formViews/editProjectForm'),
		SongModel      				= require('./models/songModel'),
		SongCollection 				= require('./collections/songCollection'),
		SongCollectionView    = require('./views/collectionViews/songCollectionView'),
		SongListItemView 			= require('./views/collectionViews/songListItemView'),
		SongForm 			  			= require('./views/formViews/songForm'),
		EditSongForm    			= require('./views/formViews/editSongForm'),
		SongDetailsView 			= require('./views/songDetailsView'),
		HeaderView 						= require('./views/headerView'),
		LoginModel 						= require('./models/loginModel'),
		LoginForm  						= require('./views/formViews/loginForm'),
		PlayerCTRL  					= require('./controllers/playerController'),
		QueueCollection    		= require('./collections/queueCollection'),
		ProjectInfoView 			= require('./views/projectInfoView');

module.exports = function() {
	var that = this;
	// Fetch data from project table
	this.index =function () {
		that.homeCollectionView.clean();
		$('#homeList').html(that.homeCollectionView.render().el);
		$("#projectList").html("");
		$("#info").html("");
		$("#info").css('display', 'none');
		$("#projectList").css('display', 'none');
	};
	this.login =function() {
		that.loginItem = new LoginModel();
		that.loginForm = new LoginForm({model: that.loginItem });
		$('#modal').html(that.loginForm.render().el);
		//$('#projectList').html(that.projectCollectionView.render().el);
		
	};
	this.logout = function() {
		console.log("logout");
		$("#projectList").css('display', 'none');
		window.localStorage.setItem('token', '');
		$("#mainContent").css("display", "none");
		that.index();
		
	};
	this.createProject = function() {
		var projectItem = new ProjectModel();
		var projectForm = new ProjectForm({model: projectItem });
		this.projectList.add(projectItem);
		this.userList = new UserCollection();
		this.userList.fetch();
		this.userCollectionView = new UserCollectionView({collection:this.userList});
		$('#modal').html(projectForm.render().el);
		$('.userList').html(this.userCollectionView.render().el);
		//$('#projectList').html(this.projectCollectionView.render().el);
		$('#header').html(this.headerView.render().el);
	};
	this.readProject = function(projectid) {
		$('#header').html(this.headerView.render().el);
		$('#projectList').html(this.projectCollectionView.render().el);
		
		var self = this;
		//if(that.projectList)
		var projectItem = new ProjectModel({id: projectid});//this.projectList.get(projectid);
		
		projectItem.fetch({
			success: function(project) {
				var projectSongs = project.attributes.songs, projectInfo;
				//console.log(projectSongs);
				self.songCollection = new SongCollection(projectSongs);//self.songCollection.set(projectSongs);//
				self.songCollection.url = "/project/" + projectid + "/song";
				self.songCollectionView = new SongCollectionView({collection:self.songCollection, 
																													controller: that.playerController});
				//$('#mainContent').html('<h2>' + project.attributes.projectname + "</h2>");
				$("#mainContent").css("display", "block");
				$('#songList').html(self.songCollectionView.render().el);
				projectInfo = new ProjectInfoView({model: project});
				$('#info').html(projectInfo.render().el);
				//console.log("getting songs " + window.localStorage.getItem('token') );

				if(window.localStorage.getItem('token')) {
					$('.admin').removeClass('hidden'); 
					//console.log("Token true");
				} else {
					$('.admin').addClass('hidden');
					//console.log("Token false");
				}
			},
			error: function(err) {
				console.log(err);
			}
		}, this);
	};
	this.updateProject = function(projectid) {
		var projectItem = this.projectList.get(projectid);
		console.log("RoutesController: updateProject: projectitem:");
		console.log(projectItem);
		var projectForm = new ProjectEditForm({model: projectItem});
		$('#modal').html(projectForm.render().el);
	};
	this.deleteProject = function(projectid) {
		var projectItem = this.projectList.remove(projectid);
		projectItem.destroy({success: function(model, response) {
			model.off('change');
		}});
	};
	this.createSong = function(projectid) {
		var projectname = this.projectList.get(projectid).attributes.projectname;
		var songItem = new SongModel();
		songItem.set({'projectid':  projectid, 'projectname': projectname });
		var songForm = new SongForm({model: songItem });
		$('#modal').html(songForm.render().el);
	};
	this.readSong = function(projectid, songid) {
		var self = this;
		$('#header').html(that.headerView.render().el);
		$('#projectList').html(that.projectCollectionView.render().el);
		
		var songItem = new SongModel({id: songid});// songCollection.get({id:songid});
		var projectItem = new ProjectModel({id: projectid});
		projectItem.fetch({
			success: function(project) {
				songItem.fetch({
					success: function(song) {
						var songView = new SongDetailsView({model: song}),
						projectInfo = new ProjectInfoView({model: project});
						
						$('#info').html(projectInfo.render().el);

						$('#songInfo').html(songView.render().el);	
						if(!self.songCollection) {
							var songs = project.attributes.songs;
							self.songCollection = new SongCollection(songs);
							//$('#mainContent').html('<h2>' + self.projectList.get(projectid).attributes.projectname + "</h2>");
							self.songCollectionView = new SongCollectionView({collection:self.songCollection});
							$('#songList').html(self.songCollectionView.render().el);
							console.log("self.projectList.get(projectid).attributes" );
							console.log(self.projectList.get(projectid).attributes );
						}
					},
					error: function(err) {
						console.log(err);
					}
				}, this);
			}
		});
		
		
	};
	this.updateSong = function(projectid, songid) {
		
		var songItem = new SongModel({id: songid});// songCollection.get({id:songid});
		
		songItem.fetch({
			success: function(song) {
				console.log("update song: " + songItem.attributes.influence);
				var songForm = new EditSongForm({model: songItem});
				$('#modal').html(songForm.render().el);
					},
					error: function(err) {
						console.log(err);
					}
				}, this);
	};
	this.deleteSong = function(projectid, songid) {
		console.log("Song ID: " + songid);
		console.log(this.songCollection);
		var songItem = this.songCollection.get(songid);
		console.log('songItem');
		console.log(songItem);
		//this.songCollection.remove(songid);
		songItem.destroy({ success: function(model, response) {
			model.off('change');
		}});
	};
	this.play = function(projectid, songid) {
		var songModel = this.songCollection.get(songid); 
		this.playerController.playFromList(songModel);
		
		/*console.log($('#musicPlayer audio').attr('src'));
		var player = $('#musicPlayer audio').attr('src', url );
		$('#musicPlayer audio').get(0).play();*/
	};
	this.allRoutes = function(e) {
		if(e === "login" || e === "createProject" ||
			 e === "updateProject" || e === "createSong" ||
			 e === "updateSong" ) {
			$('#modal').css('display', 'block');
			$('#mainContent').css('display', 'none');
			
		} else if(e ==="index") {
			$('#mainContent').css('display', 'none');
			$('#modal').css('display', 'none');
		} else {
			$('#modal').css('display', 'none');
			$('#mainContent').css('display', 'block');
		}
		if(e !== "index") {
			$("#projectList").removeClass('hidden');
			$("#info").css('display', 'block');
			
		}
		if(e !== "index" && e !== "logout") {
			that.homeCollectionView.clean();
			$("#projectList").css('display', 'block');
		}
		$('#header').html(that.headerView.render().el);

		if(that.projectList.length <= 0) {
			//console.log("fetching projects");
			that.projectList.fetch({
				success: function(projects) {
					//console.log(projects);
				}
			});
		}
	};
	this.defaultRoute = function() {
		console.log("default Route");
	};
	this.initialize = function(options) {
		that.projectList = new ProjectCollection();
		that.projectList.fetch();
		that.queueCollection = new QueueCollection();
		that.homeCollectionView = new HomeCollectionView({collection:that.projectList});
		that.projectCollectionView = new ProjectCollectionView({collection:that.projectList});
		that.playerController  = new PlayerCTRL();
		that.playerController.initialize({collection:that.queueCollection, projectList: that.projectList});
		that.headerView = new HeaderView({model: new UserModel()});
		that.songCollectionView = null;
		$('#header').html(that.headerView.render().el);
		
	};
};