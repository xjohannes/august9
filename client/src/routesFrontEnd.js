var Backbone = require('Backbone'),
		$ = require('jQuery'),
		ProjectModel = require('./models/projectModel'),
		//ProjectCollection = require('./collections/projectCollection'),
		ProjectView = require('./views/projectView'),
		//ProjectListView = require('./views/projectListView'),
		ProjectListItemView = require('./views/projectListItemView');

module.exports = Backbone.Router.extend({
	routes: {
		"": "index",
		"project/:id": "getProjectData",
		"*actions": "defaultRoute"
	},
	url: "/",
	// Fetch data from project table
	index: function () {
		this.project.fetch({
			success: function (project) {
				console.log("successs");
				
				console.log(project.toJSON());
			}
		});
		//console.log(this.project);
	},
	getProjectData: function(id) {
		//get the rest of project related data such as participators, inspiration, about and so on
		//get project songs
	},
	initialize: function(options) {
		this.project = new ProjectModel();
		this.projectView = new ProjectView({model: this.project});
		var self = this;
	},
	start: function() {
		Backbone.history.start({pushState: true});
	}
});