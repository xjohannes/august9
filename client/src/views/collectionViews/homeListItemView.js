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
		console.log("homeListItem. setupSongModels");
		console.log(songModel);
		this.featuredModel = songModel;
		this.model.set({"featuredSong": this.model.attributes.songs[0].title});
		this.featuredModel.on('playing', this.disablePlayButton, this);
		this.featuredModel.on('pause', this.enablePlayButton, this);
	},
 	playFeatured: function(event) {
 		console.log("homeListItem");
 		console.log(this.featuredModel.attributes.title);
		if(this.featuredModel.isPlaying()) {
			this.controller.pause();
		} else {
			console.log("paused. Start playing");
			this.controller.playFromList(this.model.attributes.songs[0], this);
		}
	},
	enablePlayButton: function() {
		console.log("enablePlayButton");
		this.$el.find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play-circle');
	},
	disablePlayButton: function() {
		console.log("disablePlayButton");
		this.$el.find('.glyphicon-play-circle').removeClass('glyphicon-play-circle').addClass('glyphicon-pause');
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});