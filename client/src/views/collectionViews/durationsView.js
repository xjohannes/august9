var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: require('../../../templates/player.hbs'),
	events: {
		'click': 'play'
	},
	initialize: function(options) {
		this.options = options || {};
		/*this.listenTo(this.model, 'change:token', this.clean);
		this.model.on('home:clean', this.clean, this);
		this.model.on('index', this.clean, this);*/
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	play: function() {

	},
	clean: function() {
		//console.log("cleaning loginFormView");
		this.$el.remove();
		 //window.history.back();
	}

});