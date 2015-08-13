var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	
	template: _.template('<a href="#/project/<%= id %>"><%= projectname %></a>' +
											'<a class="admin hidden" href="#/project/<%= id %>/edit"><button >Edit</button></a>' +
											'<a class="admin hidden" href="#/project/<%= id %>/delete"><button >Delete</button></a>' +
											'<a class="admin hidden" href="#/project/<%= id %>/newSong"><button >New song</button></a>'),//require('../../templates/projects.hbs'),
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