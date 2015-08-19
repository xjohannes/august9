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
		this.listenTo(Backbone.dispacher, 'index', this.index);
		this.on('change:token', function() {
			Backbone.dispacher.trigger('login:success', this);
		});
		this.on('clean:loginForm', function() {
			//Backbone.dispacher.trigger('clean:loginForm', this);
		});
	},
	index: function() {
		this.trigger('index');
	}
});
