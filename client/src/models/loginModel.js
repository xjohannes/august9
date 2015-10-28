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
		//this.listenTo(Backbone.dispatcher, 'index', this.index);
		this.on('change:token', function() {
			window.Backbone_dispatcher.trigger('login:success', this);
		});
		this.on('clean:loginForm', function() {
			//Backbone.dispatcher.trigger('clean:loginForm', this);
		});
	},
	index: function() {
		this.trigger('index');
	}
});
