 var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	//urlRoot: '/project/' + this.projectid + '/song',
	url: function() {
		
		if(this.toJSON().id === null ) {
			return '/project/' + encodeURIComponent(this.toJSON().projectid);
		} else {
			return '/project/' + encodeURIComponent(this.toJSON().projectid) + "/song/" + encodeURIComponent(this.toJSON().id);
		}
	},
	defaults: {
		id: null,
		title: false,
		projectid: null,
		productionstatus: 'raw',
		added: 'today',
		created: '',
		likes: 0,
		listens: 0,
		notes: '',
		participator: 1,
		participatorRole: 'none',
		serverkey: false,
		influence: 'none'
	},
	initialize: function() {
		this.listenTo(window.Backbone_dispatcher, 'login:success', this.triggerLoginSuccess);
		this.listenTo(window.Backbone_dispatcher, 'index', this.index);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	},
	index: function() {
		this.trigger('index');
	},
	play: function() {
		var url, self = this;
		if(!this.attributes.serverkey) {
			this.fetch({
				success: function(songModel) {
					url = './media/music/' + self.attributes.projectid + '/' +
		          self.attributes.serverkey;
					self.audioObj = new Audio(url);
					self.audioObj.play();
					self.trigger('playing', self.audioObj);
				},
				error: function(err) {
					console.log('Could not load song');
					console.log(err);
				}
			});
		} else {
			url = './media/music/' + this.attributes.projectid + '/' +
		          this.attributes.serverkey;
			this.audioObj = new Audio(url);
			this.audioObj.play();
			this.trigger('playing', this.audioObj);
		}
	},
	stop: function() {
		if(this.audioObj) {
			this.audioObj.pause();
			this.trigger('pause', this.audioObj);
		}
	},
	isPlaying: function() {
			return this.audioObj && !this.audioObj.paused;
	}
});


 
