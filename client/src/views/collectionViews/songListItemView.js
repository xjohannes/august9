var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: require('../../../templates/songListItem.hbs'),
	tagName: 'li',
	className: '',

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('login:success', this.showAdminButtons);
	},
	render: function() {
	
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		if(window.localStorage.getItem('token') !== null) {
			$('.admin').removeClass('hidden');
			console.log("token is set, songlistitemview");
		}
		
		return this;
	},
	showAdminButtons: function() {
		console.log("toggleAdminButtons song item view");
		$('.admin').show();
	}
});