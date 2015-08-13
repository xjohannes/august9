var Backbone     					= require('Backbone'),
		$            					= require('jQuery'),
		ProjectModel 					= require('./models/projectModel'),
		ProjectCollection 		= require('./collections/projectCollection'),
		ProjectView       		= require('./views/projectListItemView'),
		ProjectCollectionView = require('./views/projectCollectionView'),
		ProjectListItemView   = require('./views/projectListItemView'),
		ProjectForm           = require('./views/projectForm'),
		SongModel      				= require('./models/songModel'),
		SongCollection 				= require('./collections/songCollection'),
		SongView       				= require('./views/songListItemView'),
		SongCollectionView    = require('./views/songCollectionView'),
		SongListItemView 			= require('./views/songListItemView'),
		SongForm 			  			= require('./views/songForm'),
		EditSongForm    			= require('./views/editSongForm'),
		SongDetailsView 			= require('./views/songDetailsView'),
		LoginModel 						= require('./models/loginModel'),
		LoginForm  						= require('./views/loginForm');

module.exports = Router = Backbone.Router.extend({
	routes: {
		""			  															: "index",
		"login"   															: "login",
		"logout"   															: "logout",
		"project/newProject" 				 						: "createProject",
		"project/:projectid" 				 						: "readProject",
		"project/:id/edit"   				 						: "updateProject",
		"project/:id/delete" 				 						: "deleteProject",
		"project/:projectid/newSong" 						: "createSong",
		"project/:projectid/song/:id"						: "readSong",
		"project/:projectid/song/:songid/edit"	: "updateSong",
		"project/:projectid/song/:songid/delete": "deleteSong",
		"project/:projectid/song/:songid/play" 	: "play", 
		"*actions"															: "defaultRoute"
	},
	url: "/",
	// Fetch data from project table
	index: function () {
		$('#mainContent').html('<p>no content</p>');
		this.projectList.fetch();
		$('#sidebar').html(this.projectCollectionView.render().el);
	},
	login: function() {
		this.loginItem = new LoginModel();
		this.loginForm = new LoginForm({model: this.loginItem });
		//console.log("Login 1. Token: " + this.loginItem.get('token'));
		$('#mainContent').html(this.loginForm.render().el);
		$('#sidebar').html(this.projectCollectionView.render().el);
	},
	logout: function() {
		//this.loginItem = new LoginModel({id:1});
		console.log("logout 1. Token: " + window.localStorage.getItem('token'));
		window.localStorage.setItem('token', '');
		//this.loginItem.set('token', '');
		
		console.log('logout 2. Token: ' + window.localStorage.getItem('token'));
		$('#mainContent').html(this.songCollectionView.render().el);
		$('#sidebar').html(this.projectCollectionView.render().el);
	},
	createProject: function() {
		var projectItem = new ProjectModel();
		var projectForm = new ProjectForm({model: projectItem });
		this.projectList.add(projectItem);
		$('#mainContent').html(projectForm.render().el);
		$('#sidebar').html(this.projectCollectionView.render().el);
	},
	readProject: function(projectid) {
		$('#sidebar').html(this.projectCollectionView.render().el);
		var self = this;
		var projectItem = new ProjectModel({id: projectid});//this.projectList.get(projectid);
	
		projectItem.fetch({
			success: function(project) {
				var projectSongs = project.attributes.songs;
				self.songList = new SongCollection(projectSongs);//self.songList.set(projectSongs);//
				self.songList.url = "/project/" + projectid + "/song";
				self.songCollectionView = new SongCollectionView({collection:self.songList});
				$('#mainContent').html(self.songCollectionView.render().el);
				console.log("getting songs " + window.localStorage.getItem('token') );

				if(window.localStorage.getItem('token')) {
					$('.admin').removeClass('hidden'); 
					console.log("Token true");
				} else {
					$('.admin').addClass('hidden');
					console.log("Token false");
				}
			},
			error: function(err) {
				console.log(err);
			}
		}, this);
	},
	updateProject: function(projectid) {
		var projectItem = this.projectList.get(projectid);
		var projectForm = new ProjectForm({model: projectItem});
		$('#mainContent').html(projectForm.render().el);
	},
	deleteProject: function(projectid) {
		var projectItem = this.projectList.remove(projectid);
		projectItem.destroy({success: function(model, response) {
			model.off('change');
		}});
	},
	createSong: function(projectid) {
		var songItem = new SongModel();
		songItem.set({'projectid':  projectid });
		var songForm = new SongForm({model: songItem });
		$('#mainContent').html(songForm.render().el);
	},
	readSong: function(projectid, songid) {
		var self = this;
		$('#sidebar').html(this.projectCollectionView.render().el);
		
		this.projectList.fetch({
			success: function(song) {
				var projectItem = self.projectList.get(projectid);
				console.log("projectItem");
				console.log(projectItem);
				projectItem.fetch({
					success: function(project) {
						var projectSongs = project.attributes.songs;
						self.songList = new SongCollection(projectSongs);//self.songList.set(projectSongs);//
						self.songList.url = "/project/" + projectid + "/song";
						self.songCollectionView = new SongCollectionView({collection:self.songList});
						$('#mainContent').html(self.songCollectionView.render().el);
					},
					error: function(err) {
						console.log(err);
					}
				}, this);
				
			},
			error: function(err) {
				console.log(err);
			}
		}, this);
		
		var songItem = new SongModel({id: songid});// songCollection.get({id:songid});
		
		songItem.fetch({
			success: function(song) {
				var songView = new SongDetailsView({model: song});
				$('#description').html(songView.render().el);	
				
				var songs = self.projectList.get(projectid).attributes.songs,
						songCollection = new SongCollection(songs);
				console.log(self.projectList.get(projectid).attributes );
			},
			error: function(err) {
				console.log(err);
			}
		}, this);
		
	},
	updateSong: function(projectid, songid) {
		console.log("update song:");
		var songItem = this.songList.get(songid);
		console.log(songItem.attributes);
		var songForm = new EditSongForm({model: songItem});
		$('#mainContent').html(songForm.render().el);
	},
	deleteSong: function(projectid, songid) {
		console.log("Song ID: " + songid);
		var songItem = this.songList.remove(songid);
		console.log(songItem.attributes);
		
		songItem.destroy({success: function(model, response) {
			model.off('change');
		}});
	},
	play: function(projectid, songid) {

		console.log("PLAY");
		var url = './media/music/' + this.songList.get(songid).attributes.serverkey;
		console.log(url);
		console.log($('#musicPlayer audio').attr('src'));
		var player = $('#musicPlayer audio').attr('src', url );
		$('#musicPlayer audio').get(0).play();

		
	},
	defaultRoute: function() {
		console.log("default Route");
	},
	initialize: function(options) {
		this.self = this;
		this.projectList = new ProjectCollection();
		this.projectList.fetch({success: function(){Backbone.history.start();}});
		this.projectCollectionView = new ProjectCollectionView({collection:this.projectList});
		this.projectCollectionView.render();
	},
	start: function() {
		//console.log("Starting history");
		//Backbone.history.start();
	}
});