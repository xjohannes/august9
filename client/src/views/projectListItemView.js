var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	
	template: _.template('<a href="#project/<%= id %>"><%= projectname %></a>' +
											'<button class="admin hidden"><a href="#project/<%= id %>/edit">Edit</a></button>' +
											'<button class="admin hidden"><a href="#project/<%= id %>/delete">Delete</a></button>' +
											'<button class="admin hidden"><a href="#project/<%= id %>/newSong">New song</a></button>'),//require('../../templates/projects.hbs'),
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
		$('.admin').toggleClass('hidden');
	}
});