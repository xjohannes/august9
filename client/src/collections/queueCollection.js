var Backbone = require('Backbone'),
		SongModel = require('../models/songModel'),
		_					= require('underscore');

module.exports = Backbone.Collection.extend({
	model: SongModel,
	url: '/project/',
	self: this,
	initialize: function(options) {
		this.options 			= options || {};
		this.projectList 	= this.options.projectList;
	},
	fetchProjectSongs: function(projects) {
		var self = this;
		this.reset(null);
		this.projectList.each(function(element, index, list) {
			element.fetch({
				success: function(project) {
					var projectSongs = project.attributes.songs;
					_.each(projectSongs, function(element, index, list) {
						self.add(element);
					});
					element.trigger('loadedFeaturedSong', self.get(projectSongs[0].id));
				}
			});
		});

	},
	getQueueTop: function() {
		return this.at(0);
	},
	previousTrack: function() {
		var tmpModel = this.pop();
		this.unshift(tmpModel);
		return tmpModel;
	},
	nextTrack: function() {
		var tmpModel = this.shift();
		this.push(tmpModel);
		return this.getQueueTop();
	},
	addToTopOfQueue: function(model) {
		var tmpModel = this.remove(model);
		this.unshift(tmpModel);
	},
	addToQueue: function(model) {
		this.add(model);
	}
});