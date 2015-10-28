var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: require('../../../templates/songForm.hbs'),
	events: {
		'submit': 'clean',
		"change input[type=file]" : "encodeFile"
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	encodeFile: function() {
		// Better to get it from the userobject?
		var token = window.localStorage.getItem('token');
		
		// This is not secure. But havn't found out how to overcome the problems of encoding the header 
		// when the form is send without the help of Backbone(jquery ajax).
		// The server does not get the body in the middleware
		var actionUrl = this.$('#uploadForm').attr('action');
		actionUrl += "?token=" + token;
		this.$('#uploadForm').attr('action', actionUrl);
		//Backbone.history.navigate("#/", {trigger: true});
	},
	save: function(e) {
		this.model.fetch({
			success: function(song) {
				console.log("this.model.influence");
				console.log(this.model.influence);
			}
		});
	},
	clean: function() {
		console.log("cleaning songFormView");
		this.$el.empty();
		
	}
});