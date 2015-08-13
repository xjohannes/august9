var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: _.template('<a href="#/project/<%= projectid %>/song/<%= id %>/play"><button>Play</button></a>' +
											 '<p><a href="#/project/<%= projectid %>/song/<%= id %>">' +
											 '<%= title %></a></p>' +
											 '<a class="admin hidden" href="#/project/<%= projectid %>/song/<%= id %>/edit"><button >Edit</button></a>' +
											 '<a class="admin hidden" href="#/project/<%= projectid %>/song/<%= id %>/delete"><button >Delete</button></a>'),//require('../../templates/projects.hbs'),
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