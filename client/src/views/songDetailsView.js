var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<h2><%= title %></h2>' +
												'<p>projectname: <%= projectname %></p>' +
												'<p>productionstatus: <%= productionstatus %></p>' +
												'<p>influence: <%= influence %></p>' +
												'<p>participators userid: <%= participation.userid %></p>' +
												'<p>participators role: <%= participation.role %></p>'),
	tagName: 'aside',

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('index', this.clean, this);
	},
	render: function() {
		//console.log("SongDetailsView render: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	},
	clean: function() {
		console.log("cleaning songDetailView");
		this.$el.empty();
	}
});