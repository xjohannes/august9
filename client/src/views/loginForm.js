var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: require('../../templates/login.hbs'),
	events: {
		'submit': 'save'
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	save: function(e) {
		//console.log("Logging in");
		
		e.preventDefault();
		var username = this.$('input[name=username]').val();
		var password = this.$('input[name=password]').val();
		var self = this;
		this.model.save({
			username: username,
			password: password,

		}, {success: function() {
			//console.log("token: " + self.model.get('token'));
			window.localStorage.setItem('token', self.model.get('token'));
			// trigger authorized on the model

		}});
	
	}

});