var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<h2><%= title %></h2>' +
												'<p>projectname: <%= projectname %></p>' +
												'<p>productionstatus: <%= productionstatus %></p>' +
												'<p>influence: <%= influence %></p>' +
												'<p>participators userid: <%= participation.userid %></p>' +
												'<p>participators role: <%= participation.role %></p>' +
												'<p>serverkey: <%= serverkey %></p>'),//require('../../templates/projects.hbs'),
	tagName: 'aside',

	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function() {
		console.log("SongDetailsView render: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});