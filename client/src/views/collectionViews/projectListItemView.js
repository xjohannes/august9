var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	
	template: require('../../../templates/projectListItem.hbs'),
	tagName: 'li',
	className: '',
	
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('login:success', this.toggleAdminButtons);
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		this.toggleAdminButtons();
		return this;
	},
	toggleAdminButtons: function() {
		//console.log("toggleAdminButtons");
		var token = window.localStorage.getItem('token');
		if(token) {
			$('.admin').removeClass('hidden');
			//console.log("removeClass");
		} else {
			$('.admin').addClass('hidden');
			//console.log("addClass");
		}
		
	}
});