var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		SongListItemView = require('./songListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',
	

	initialize: function(options) {
		this.options = options || {};
		this.controller = options.controller;
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);	
	},
	addOne: function(songItem) {
		//console.log("Add one : " );
		//console.log(songItem.toJSON());
		var songView = new SongListItemView({model: songItem, controller: this.controller});
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
		console.log("remove item from song collection view");
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	clean: function() {
		console.log("cleaning songCollectionView");
		this.$el.empty();
	}
	
});