var Backbone = require('Backbone');
var ProjectModel = require('../models/projectModel');

module.exports = Backbone.Collection.extend({
	model: ProjectModel,
	url: "/project/"
});