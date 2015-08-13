var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: _.template(
'<div class="container">' +

'<div class="col-sm-6 col-sm-offset-3">' +

'    <h1><span class="fa fa-sign-in"></span> Login </h1>' +

'    <!-- show any messages that come back with authentication -->' +
'    <% if (message.length > 0) { %>' +
'        <div class="alert alert-danger"><%= username %></div>' +
'    <% } %>' +

'    <!-- LOGIN FORM -->' +
'    <form action="/login" method="post">' +
'        <div class="form-group">' +
'            <label>Username</label>' +
'            <input type="text" class="form-control" name="username">' +
'        </div>' +
'        <div class="form-group">' +
'            <label>Password</label>' +
'            <input type="password" class="form-control" name="password">' +
'        </div>' + 

'        <button type="submit" class="btn btn-warning btn-lg">Login</button>' +
'    </form>' +
'    <hr>' +
'</div>' +

'</div>'),
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