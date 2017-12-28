var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: require('../../templates/projectInfo.hbs'),
	
	initialize: function(options) {
		this.options = options || {};
		//this.project = options.project;
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	}

});