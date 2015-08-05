var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<p>Song name: <%= title %></p>'),//require('../../templates/projects.hbs'),
	tagName: 'li',

	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function() {
		console.log("SongView render: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});