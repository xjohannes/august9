var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = ProjectView = Backbone.View.extend({
	
	template: _.template('Project name<p><%= projectname %></p>'),//require('../../templates/projects.hbs'),

	events: {
		'change' : 'testEvents'
	},
	initialize: function() {
		this.model.on('change', this.render, this);
	},
 	testEvents : function() {
		console.log("test event triggerd");
	},
	render: function() {
		console.log("ProjectView attributesss: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes[0]));
		$('#sidebar').html(this.el);
	}
});