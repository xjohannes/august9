var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	template: _.template(
		'<form id =  "uploadForm"' +
     'enctype   =  "multipart/form-data"' +
     'action    =  "/project/<%= projectid %>"' +
     'method    =  "post">' +

   		'<input type="hidden" name="projectname" value="<%= projectname %>" /><br>' +
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
		'submit': 'save'
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	save: function(e) {
		/*
		e.preventDefault();
		var productionstatus = this.$('input[name=productionstatus]').val();
		var notes = this.$('input[name=notes]').val();
		var created = this.$('input[name=created]').val();
		var influence = this.$('input[name=influence]').val();
		var participator = this.$('input[name=participator]').val();
		var participatorRole = this.$('input[name=participatorRole]').val();
		var datafile = this.$('input[name=file]').val();
		this.model.save({
			projectid: this.model.get('projectid'),
			projectname: this.model.get('projectname'),
			productionstatus: productionstatus,
			notes: notes,
			created: created,
			influence: influence,
			participator: participator,
			participatorRole: participatorRole,
			datafile: datafile
		});
	*/
	}
});