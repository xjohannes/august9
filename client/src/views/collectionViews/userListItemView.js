var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: require('../../../templates/userListItem.hbs'),
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
		console.log("toggleAdminButtons user item view");
		$('.admin').toggleClass('hidden');
	}
});