var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		ProjectListItemView = require('./projectListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);
	},
	addOne: function(projectItem) {
		//console.log("project Item : " );
		//console.log(projectItem.toJSON());
		var projectView = new ProjectListItemView({model: projectItem});
		this.$el.append(projectView.render().el);
	},
	addAll: function() {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	remove: function(project) {
		//console.log("remove item from project collection view");
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.addAll();
		//$('#sidebar').html(this.el);
		return this;
	}
	
});