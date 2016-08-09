var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	events: {
		'click .listPlayer': 'playFeatured'

	},
	template: require('../../../templates/homeListItem.hbs'),
	tagName: 'li',
	className: 'homeItem',

	initialize: function(options) {
		this.options 		= options || {};
		this.controller = options.controller;
		this.model.on('change', this.render, this);
		this.model.on('loadedFeaturedSong', this.setupSongModels, this);
		
	},
	setupSongModels: function(songModel) {
		this.featuredModel = songModel;
		this.model.set({"featuredSong": this.model.attributes.songs[0].title});
		this.featuredModel.on('playing', this.disablePlayButton, this);
		this.featuredModel.on('pause', this.enablePlayButton, this);
	},
 	playFeatured: function(event) {
		this.controller.play(this.model.attributes.songs[0], this);
	},
	enablePlayButton: function() {
		this.$el.find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play-circle');
	},
	disablePlayButton: function() {
		this.$el.find('.listPlayer').removeClass('glyphicon-play-circle').addClass('glyphicon-pause');
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});