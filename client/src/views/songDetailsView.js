var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: require('../../templates/songInfo.hbs'),
	tagName: 'aside',

	initialize: function(options) {
		this.options 		= options || {};
		this.project    = options.project;
		this.model.on('change', this.render, this);
		this.model.on('index', this.clean, this);
	},
	render: function() {
		//console.log("SongDetailsView render: " );
		var attributes = this.model.toJSON();
		this.$el.html(this.template(attributes));
		
		return this;
	},
	clean: function() {
		console.log("cleaning songDetailView");
		this.$el.empty();
	}
});