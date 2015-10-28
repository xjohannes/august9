var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/user/',
	defaults: {
		userid: null,
		username: "default user",
		email: "no email",
		firstname: 'John',
		lastname: 'Dough',
		regdate: 'some date',
		avatarurl: './media/avatars/default-avatar.jpg',
		token: ""
	},
	initialize: function() {
		this.listenTo(window.Backbone_dispatcher, 'login:success', this.triggerLoginSuccess);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	}
});
