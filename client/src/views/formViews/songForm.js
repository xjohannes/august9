var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: _.template(
		'<form id =  "uploadForm"' +
     'enctype   =  "multipart/form-data"' +
     'action    =  "/project/<%= projectid %>"' +
     'method    =  "post">' +
     	'<input type="hidden" name="projectid" value="<%= projectid %>">' +
			'Productionstatus:<input type="text" name="productionstatus" value="<%= productionstatus %>" /><br>' +
			'Notes: <input type="text" name="notes" value="<%= notes %>" /><br>' +
			'Created: <input type="text" name="created" value="<%= created %>" /><br>' +
			'Influence: <input type="text" name="influence" value="<%= influence %>" /><br>' +
			'Participator: <input type="text" name="participator" value="<%= participator %>" /><br>' +
			'Participator Role: <input type="text" name="participatorRole" value="<%= participatorRole %>" /><br>' +
			'<input type="file" name="file" /><br>' +                 
			'<input type="submit" value="Save" name="submit">' +
		'</form>'),
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
		Backbone.history.navigate("#/", {trigger: true});
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