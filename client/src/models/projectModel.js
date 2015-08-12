var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/project/',
	defaults: {
		id: null,
		projectname: "default projectnameeeee",
		email: "no emaillll",
		songs: [],
		influence: ['HM Kongen', 'Dronning Sonia'],
		participator: [1],
		participatorRole: ['Role'],
		about: ""

	}
});
