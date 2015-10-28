var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		HomeListItemView = require('./homeListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);
	},
	addOne: function(projectItem) {
		var homeView = new HomeListItemView({model: projectItem});
		this.$el.append(homeView.render().el);
	},
	addAll: function() {
		//console.log("cleaning homeCollectionView ADD ALL");
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	remove: function(project) {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.addAll();
		return this;
	},
	clean: function() {
		//console.log("cleaning homeCollectionView");
		this.$el.empty();
	}
	
});