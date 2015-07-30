var Backbone = require('Backbone'),
		
		$ = require('jQuery');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.model.bind("reset", this.render, this);
	},

	render: function(event) {
		_.each(this.model.models, function(project) {
			$(this.el).append(new ProjectListItemView({ model:project}).render().el);
		}, this);
		return this;
	}
});