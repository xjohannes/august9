var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		ProjectListItemView = require('./projectListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',
	className: '',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);
		this.collection.on('index', this.clean, this);
		this.collection.on('edit:project', this.render, this);
	},
	addOne: function(projectItem) {
		var projectView = new ProjectListItemView({model: projectItem});
		this.$el.append(projectView.render().el);
	},
	addAll: function() {

		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	remove: function(project) {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.$el.removeClass('hidden');
		//this.$el.css('display', block);
		this.addAll();
		return this;
	},
	clean: function(user) {
		console.log("cleaning projectCollectionView");
		this.$el.addClass('hidden');
		this.$el.empty();
	}
	
});