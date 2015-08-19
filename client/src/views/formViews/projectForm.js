var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: require('../../../templates/projectForm.hbs'),
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
	},
	clean: function() {
		console.log("cleaning projectFormView");
		this.$el.empty();
		//window.history.back();
	}
});