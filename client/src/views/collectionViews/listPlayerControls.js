var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: require('../../../templates/playerControls.hbs'),
	events: {
		'click i': 'parseClick',
		'click #playCircle': 'play'

	},
	initialize: function(options) {
		this.options = options || {};
		this.controller = options.controller;
		//this.listenTo(this.model, 'change:token', this.clean);
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
		
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	play: function(url) {
		this.controller.play();
	},
	parseClick: function(e) {
		if(e.target.className.indexOf('glyphicon-step-backward') !== -1) {
			console.log("previous track");
			this.controller.previousTrack();
		} else if(e.target.className.indexOf('glyphicon-step-forward') !== -1){
			console.log("next track");
			this.controller.nextTrack();
		}
	},

	enablePlayButton: function() {
		console.log('enablePlayButton');
		$('#playerControls .glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
	},
	disablePlayButton: function() {
		console.log('disablePlayButton');
		$('#playerControls .glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
	},
	clean: function() {
		//console.log("cleaning loginFormView");
		this.$el.remove();
		 //window.history.back();
	},
	registerNewModel: function(newModel) {
		this.model.off('playing', this.disablePlayButton, this);
		this.model.off('pause', this.enablePlayButton, this);
		this.model = newModel;
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
	}

});