var Backbone = require('Backbone'),
		UserModel = require('../models/userModel');

module.exports = Backbone.Collection.extend({
	model: UserModel,
	url: '/user/'
});