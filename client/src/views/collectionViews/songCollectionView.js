var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		SongListItemView = require('./songListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',
	

	initialize: function(options) {
		this.options 		= options || {};
		this.controller = options.controller;
		this.project		= options.project;
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);	
	},
	addOne: function(songItem) {
		var songView = new SongListItemView({model: songItem, 
			controller: this.controller,
			project: this.project});
		this.$el.append(songView.render().el);
	},
	addAll: function() {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.addAll();
		return this;
	},
	remove: function(project) {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	clean: function() {
		this.$el.empty();
	}
	
});