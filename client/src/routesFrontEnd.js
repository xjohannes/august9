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
		SongModel      				= require('./models/songModel'),
		SongCollection 				= require('./collections/songCollection'),
		SongCollectionView    = require('./views/collectionViews/songCollectionView'),
		SongListItemView 			= require('./views/collectionViews/songListItemView'),
		SongForm 			  			= require('./views/formViews/songForm'),
		EditSongForm    			= require('./views/formViews/editSongForm'),
		SongDetailsView 			= require('./views/songDetailsView'),
		HeaderView 						= require('./views/headerView'),
		LoginModel 						= require('./models/loginModel'),
		LoginForm  						= require('./views/formViews/loginForm');

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
		this.controller.index();
	},
	login: function() {
		this.controller.login();
	},
	logout: function() {
		this.controller.logout();
	},
	createProject: function() {
		this.controller.createProject();
	},
	readProject: function(projectid) {
		this.controller.readProject(projectid);
	},
	updateProject: function(projectid) {
		this.controller.updateProject(projectid);
	},
	deleteProject: function(projectid) {
		this.controller.delete(projectid);
	},
	createSong: function(projectid) {
		this.controller.createSong(projectid);
	},
	readSong: function(projectid, songid) {
		this.controller.readSong(projectid, songid);
	},
	updateSong: function(projectid, songid) {
		this.controller.updateSong(projectid, songid);
	},
	deleteSong: function(projectid, songid) {
		this.controller.deleteSong(projectid);
	},
	play: function(projectid, songid) {
		this.controller.play(projectid, songid);
	},
	allRoutes: function(e) {
		this.controller.allRoutes(e);
	},
	defaultRoute: function() {
		this.controller.defaultRoute();
	},
	initialize: function(options) {
		this.on('route', this.allRoutes, this);
		this.controller = options.controller;
		this.self = this;
		this.projectList = new ProjectCollection();
		this.projectList.fetch();
		this.homeCollectionView = new HomeCollectionView({collection:this.projectList});
		this.projectCollectionView = new ProjectCollectionView({collection:this.projectList});
		this.projectCollectionView.render();
		this.homeCollectionView.render();
		this.headerView = new HeaderView({model: new UserModel()});
		$('#header').html(this.headerView.render().el);


	},
	start: function() {
		//console.log("Starting history");
		Backbone.history.start();
	}
});