var Backbone = require('backbone'),
		$ = require('jQuery'),
		_ = require('underscore');

module.exports  = Backbone.View.extend({
	
	template: require('../../../templates/songListItem.hbs'),
	events: {
		'click .listPlayer': 'play'
	},
	tagName: 'li',
	className: '',

	initialize: function(options) {
		this.options 		= options || {};
		this.controller = options.controller;
		this.model.on('change', this.render, this);
		this.model.on('login:success', this.showAdminButtons);
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
	},
	render: function() {
		var attributes = this.model.toJSON();
		attributes.project = this.project;
		this.$el.html(this.template(attributes));
		if(this.model.audioObj) {
			if(this.model.audioObj.paused) {
				this.enablePlayButton();
			} else {
				this.disablePlayButton();
			}
		}

		if(window.localStorage.getItem('token') !== null) {
			$('.admin').removeClass('hidden');
		}
		
		return this;
	},
	play: function(event) {

		/*var tmp = $(event.currentTarget).hasClass("glyphicon-play-circle");
		console.log(event);
		if(!tmp) {
			this.controller.pause();
		} else {
			this.controller.play();
		}*/
		this.controller.playFromList(this.model, this);
	},
	showAdminButtons: function() {
		$('.admin').show();
	},
	enablePlayButton: function() {
		this.$el.find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play-circle');
	},
	disablePlayButton: function() {
		this.$el.find('.listPlayer').removeClass('glyphicon-play-circle').addClass('glyphicon-pause');
	},
	registerNewModel: function(newModel) {
		this.model.off('playing', this.disablePlayButton, this);
		this.model.off('pause', this.enablePlayButton, this);
		this.model = newModel;
		this.model.on('playing', this.disablePlayButton, this);
		this.model.on('pause', this.enablePlayButton, this);
	}
});