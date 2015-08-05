var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	
	template: _.template('<p>Project name: <%= projectname %></p>'),//require('../../templates/projects.hbs'),
	tagName: 'li',
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
		console.log("ProjectListItemView render: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});