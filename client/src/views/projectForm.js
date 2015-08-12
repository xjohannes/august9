var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: _.template(
		'<form >' +
			'Project name:   <input type="text" name="projectname" value="<%= projectname %>" /><br>' +
			 'Email:       <input type="text" name="email" value="<%= email %>" /><br>' +
			 'About:  <input type="text" name="about" value="<%= about %>" /><br>' +
			 'Influences:  <input type="text" name="influence" value="<%= influence %>" /><br>' +
			 'Participator:<input type="text" name="participator" value="<%= participator %>" /><br>' +
			 'Participants role:<input type="text" name="participatorRole" value="<%= participatorRole %>" /><br>' +
			 '<button type="submit" value="Save" name="">Save</button>' +
		'</form>'),
	events: {
		'submit': 'save'
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	save: function(e) {
		
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
	}
});