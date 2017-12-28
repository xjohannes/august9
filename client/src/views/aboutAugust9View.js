var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({
	
	template: require('../../templates/aboutAugust9.hbs'),
	className: 'homeItem',

	initialize: function() {
		//this.model.on('change', this.render, this);
	},
	render: function() {
		//var attributes = this.model.toJSON();
		this.$el.html(this.template());
		
		return this;
	}
});