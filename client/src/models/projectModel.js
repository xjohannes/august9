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
		about: "About text bla bla",
		imgthumb: '',
		imglarge: '',
		imgalt:  '',
		featuredSong: "unavailable"
	},
	initialize: function() {
		this.listenTo(window.Backbone_dispatcher, 'login:success', this.triggerLoginSuccess);
		this.listenTo(window.Backbone_dispatcher, 'edit:project', this.triggerEditProject);

		this.listenTo(window.Backbone_dispatcher, 'index', this.index);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	},
	triggerEditProject: function() {
		console.log("edit project triggered");
		this.trigger('edit:project');
	},
	index: function() {
		this.trigger('index');
	}
});
