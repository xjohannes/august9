var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<a href="#project/<%= projectid %>/song/<%= id %>/play"><button>Play</button></a>' +
											 '<p><a href="#/project/<%= projectid %>/song/<%= id %>">' +
											 '<%= title %></a></p>' +
											 '<a href="#project/<%= projectid %>/song/<%= id %>/edit"><button>Edit</button></a>' +
											 '<a href="#project/<%= projectid %>/song/<%= id %>/delete"><button>Delete</button></a>'),//require('../../templates/projects.hbs'),
	tagName: 'li',

	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function() {
	
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	}
});