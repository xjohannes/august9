var Backbone = require('Backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports = Backbone.View.extend({

	tagName: "li",

	template: _.template('<p><%= email %></p>'),
	//template: require('../../templates/projectItem.hbs'),

	render: function(event) {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		//var html = '<p>' + this.model.get('email') + '</p>';
		//this.$el.html(html);
		//$(this.el).html(html);//this.template(this.model.toJSON())
		return this;
	}
});