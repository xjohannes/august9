var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/project/',
	defaults: {
		id: null,
		projectname: "default projectname",
		email: "no email",
		songs: [],
		influence: ['none'],
		participator: [1],
		participatorRole: [],
		about: ""
	},
	initialize: function() {
		this.listenTo(Backbone.dispacher, 'login:success', this.triggerLoginSuccess);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	}
});
