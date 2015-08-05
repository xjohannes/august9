var Backbone = require('Backbone'),
		$ = require('jQuery'),
		ProjectModel = require('./models/projectModel'),
		ProjectCollection = require('./collections/projectCollection'),
		ProjectView = require('./views/projectListItemView'),
		ProjectCollectionView = require('./views/projectCollectionView'),
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
		this.projectList.fetch({
			success: function (project) {
				console.log("project length");
				console.log(project.length);
				
				//self.projectCollectionView.render();
				//console.log("routes initialize success:")
				//console.log(self.projectCollectionView.el);
			}
		}, this);
		//$('#sidebar').html(this.projectCollectionView.render());
		//console.log(this.project);
	},
	getProjectData: function(id) {
		console.log("DEBUG. getProjectData. Id : " + id);
		$('#sidebar').html("hei: " + id);
		//get the rest of project related data such as participators, inspiration, about and so on
		//get project songs
	},
	initialize: function(options) {
		this.projectList = new ProjectCollection();
		var self = this;
		this.projectList.on("reset", function() {
			console.log("the modelList changed.");
			console.log(this.projectList.length);
		}, this);
		
		
		this.projectCollectionView = new ProjectCollectionView({collection:this.projectList});
		this.projectCollectionView.render();
		console.log("routes initialize");
		console.log(this.projectCollectionView.el);
		//var testAtt = 

		var testModel1 = new ProjectModel({id: 1});
		testModel1.fetch({
			success: function (project) {
				console.log("DEBUG: project id 1");
				console.log(project.toJSON());
				
				//self.projectCollectionView.render();
				//console.log("routes initialize success:")
				//console.log(self.projectCollectionView.el);
			}
		});
		console.log("test model1: " );
		console.log(testModel1.toJSON());

	},
	start: function() {
		Backbone.history.start({pushState: true});
	}
});