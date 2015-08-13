var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/login',
	defaults: {
		username: "user",
		password: "password",
		message : "",
		token   : ""
	},
	initialize: function() {
		this.on('change:token', function() {
			Backbone.dispacher.trigger('login:success', this);
		});
	}
});
