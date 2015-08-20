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
		about: "",
		imgthumb: '',
		imglarge: '',
		imgalt:  ''
	},
	initialize: function() {
		this.listenTo(Backbone.dispacher, 'login:success', this.triggerLoginSuccess);
		this.listenTo(Backbone.dispacher, 'index', this.index);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	},
	index: function() {
		this.trigger('index');
	}
});
