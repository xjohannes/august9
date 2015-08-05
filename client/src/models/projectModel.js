var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/project/',
	defaults: {
		projectname: "default projectname",
		email: "no email",
		songs: [],
		influences: [],
		participation: []
	}
});
