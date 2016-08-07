var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: require('../../../templates/editSongForm.hbs'),
	events: {
		'submit': 'save'
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		console.log(this.model.attributes);
		return this;
	},
	save: function(e) {
		
		e.preventDefault();
		var productionstatus = this.$('input[name=productionstatus]').val();
		var title = this.$('input[name=title]').val();
		var notes = this.$('input[name=notes]').val();
		var created = this.$('input[name=created]').val();
		var influence = this.$('input[name=influence]').val();
		var participator = (typeof this.$('input[name=participator]').val() === 'number'? this.$('input[name=participator]').val() : 1);
		var participatorRole = this.$('input[name=participatorRole]').val();
		var datafile = this.$('input[name=file]').val();
		var chorustime = this.$('input[name=chorustime]').val();
		this.model.save({
			projectid: this.model.get('projectid'),
			title: title,
			chorustime: chorustime,
			productionstatus: productionstatus,
			notes: notes,
			created: created,
			influence: influence,
			participator: participator,
			participatorRole: participatorRole
		});
	},
	clean: function() {
		console.log("cleaning editSongFormView");
		this.$el.empty();
	}
});