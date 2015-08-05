var Backbone = require('Backbone'),
		SongModel = require('../models/songModel');

module.exports = Backbone.Collection.extend({
	model: SongModel,
	url: "/project/:projectName/"
});