var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore'),
		Handlebars = require('handlebars');

module.exports = Backbone.View.extend({
	template: require('../../../templates/playerControls.hbs'),
	events: {
		'click #playerControls i': 'parseClick',
		'click #playCircle': 'play_pause',
		'click #chorusTime': 'goToChorus'
	},
	initialize: function(options) {
		this.options = options || {};
		this.controller = options.controller;
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
	},
	render: function() {
		var attributes = this.model.toJSON();
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	play_pause: function(event) {
		if($("#playerControls i:nth-child(2)").attr('class') !== "glyphicon glyphicon-play") {
			this.controller.pause();
		} else {
			this.controller.play();
		}
	},
	parseClick: function(e) {
		if(e.target.className.indexOf('glyphicon-step-backward') !== -1) {
			this.controller.previousTrack();
		} else if(e.target.className.indexOf('glyphicon-step-forward') !== -1){
			this.controller.nextTrack();
		}
	},

	enablePlayButton: function() {
		$('#playerControls .glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
	},
	disablePlayButton: function() {
		$('#playerControls .glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
	},
	clean: function() {
		this.$el.remove();
	},
	registerNewModel: function(newModel) {
		this.model.off('playing', this.disablePlayButton, this);
		this.model.off('pause', this.enablePlayButton, this);
		this.model = newModel;
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
	},
	goToChorus: function(event) {
		this.controller.goToChorus(event);
	}

});