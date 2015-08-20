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
		title: 'default title',
		projectid: null,
		productionstatus: 'raw',
		added: 'today',
		created: '',
		likes: 0,
		listens: 0,
		notes: '',
		participator: 1,
		participatorRole: 'none',
		serverkey: '',
		influence: 'none'
	},
	initialize: function() {
		this.listenTo(Backbone.dispacher, 'login:success', this.triggerLoginSuccess);
		this.listenTo(Backbone.dispacher, 'index', this.index);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	},
	index: function() {
		this.trigger('index');
	}
});


 
