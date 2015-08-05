var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		ProjectListItemView = require('./projectListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	},
	addAll: function() {
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.addAll();
		$('#sidebar').html(this.el);
	},
	addOne: function(projectItem) {
		console.log("project Item : " );
		console.log(projectItem.toJSON());
		var projectView = new ProjectListItemView({model: projectItem});
		this.$el.append(projectView.render().el);
	}
});