var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		HomeListItemView = require('./homeListItemView'),
        PlayerControlsView		= require('./playerControlsView');

module.exports = Backbone.View.extend({
	tagName: 'div',
    template: require('../../../templates/playerControls.hbs'),

	initialize: function(options) {
        this.options = options || {};
        this.controller = options.controller;

		/*this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);*/
	},
	buildPlayer: function() {
        console.log("PlayerCollectionsView: Building Player!" );
		var infoView, controlsView, volumeView, queueView;
		//infoView = new InfoView({projectModel: projectItem, songModel: songItem});
        controlsView = new PlayerControlsView({model: this.model, controller: this});
        controlsView.render();
		//this.$el.append(homeView.render().el);
	},
	addAll: function() {
		//console.log("cleaning homeCollectionView ADD ALL");
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	remove: function(project) {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.buildPlayer();
        var attributes = this.model.toJSON();
        this.$el.html(this.template(this.model.attributes));
        return this;
		//this.addAll();
		return this;
	},
	clean: function() {
		//console.log("cleaning homeCollectionView");
		this.$el.empty();
	}
	
});