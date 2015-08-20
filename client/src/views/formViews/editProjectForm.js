var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: _.template('<form id =  "projectForm"' +
     'enctype   =  "multipart/form-data"' +
     'action    =  "/project/edit/<%= id %>"' +
     'method    =  "post">' +
     '<input type="hidden" name="id" value="<%= id %>">' +
			'Project name:<input type="text" name="projectname" value="<%= projectname %>" /><br>' +
			'Email: <input type="text" name="email" value="<%= email %>" /><br>' +
			'About: <input type="text" name="about" value="<%= about %>" /><br>' +
			'Influence: <input type="text" name="influence" value="<%= influence %>" /><br>' +
			'Participator: <input type="text" name="participator" value="<%= participator %>" /><br>' +
			'Participator Role: <input type="text" name="participatorRole" value="<%= participatorRole %>" /><br>' +
			'Project image: <input type="file" name="file" /><br>' + 
			'Image description: <input type="text" name="imgalt" value="<%= imgalt %>" /><br>' +                
			'<input type="submit" value="Edit" name="submit">' +
		'</form>'),
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
				console.log("this.model.influence");
				console.log(this.model.influence);
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
		console.log(token);
		// This is not secure. But havn't found out how to overcome the problems of encoding the header 
		// when the form is send without the help of Backbone(jquery ajax).
		// The server does not get the body in the middleware
		var actionUrl = this.$('#projectForm').attr('action');
		console.log(actionUrl);
		actionUrl += "?token=" + token;
		this.$('#projectForm').attr('action', actionUrl);
		Backbone.history.navigate("#/", {trigger: true});
	},
	clean: function() {
		console.log("cleaning projectFormView");
		this.$el.empty();
		//window.history.back();
	}
});