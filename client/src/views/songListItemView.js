var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<button class="show"><a href="#project/<%= projectid %>/song/<%= id %>/play">Play</a></button>' +
											 '<p><a href="#/project/<%= projectid %>/song/<%= id %>">' +
											 '<%= title %></a></p>' +
											 '<button class="admin hidden"><a href="#project/<%= projectid %>/song/<%= id %>/edit">Edit</a></button>' +
											 '<button class="admin hidden"><a href="#project/<%= projectid %>/song/<%= id %>/delete">Delete</a></button>'),//require('../../templates/projects.hbs'),
	tagName: 'li',

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('login:success', this.toggleAdminButtons);
	},
	render: function() {
	
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	},
	toggleAdminButtons: function() {
		console.log("toggleAdminButtons song item view");
		$('.admin').toggleClass('hidden');
	}
});