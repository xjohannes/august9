var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: require('../../../templates/projectForm.hbs'),
	events: {
		'submit': 'save',
		"change input[type=file]" : "encodeFile"
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	save: function(e) {
		this.model.fetch({
			success: function(song) {
				//console.log("this.model.influence");
				//console.log(this.model.influence);
			}
		});
		/*
		e.preventDefault();
		var projectname = this.$('input[name=projectname]').val();
		var email = this.$('input[name=email]').val();
		var about = this.$('input[name=about]').val();
		var influence = this.$('input[name=influence]').val();
		var participator = this.$('input[name=participator]').val();
		var participatorRole = this.$('input[name=participatorRole]').val();
		this.model.save({
			projectname: projectname,
			about: about,
			email: email,
			influence: influence,
			participator: participator,
			participatorRole: participatorRole
		});
*/
	},
	encodeFile: function() {
		// Better to get it from the userobject?
		var token = window.localStorage.getItem('token');
		//console.log(token);
		// This is not secure. But havn't found out how to overcome the problems of encoding the header 
		// when the form is send without the help of Backbone(jquery ajax).
		// The server does not get the body in the middleware
		var actionUrl = this.$('#projectForm').attr('action');
		//console.log(actionUrl);
		actionUrl += "?token=" + token;
		this.$('#projectForm').attr('action', actionUrl);
		//Backbone.history.navigate("#/", {trigger: true});
	},
	clean: function() {
		console.log("cleaning projectFormView");
		this.$el.empty();
		//window.history.back();
	}
});