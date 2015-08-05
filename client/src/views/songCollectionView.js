var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		ProjectListItemView = require('./projectListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		//this.model.on("reset", this.render, this);
	},

	render: function() {
		this.collection.forEach(this.addOne, this);
		$('#sidebar').html(this.el);
	},
	addOne: function(projectItem) {
		var projectView = new ProjectListItemView({model: projectItem});
		this.$el.append(projectView.render().el);
	}
});