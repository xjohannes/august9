var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: 'http://localhost:5000/project',
	defaults: {
		title: "default title"
	}
});
