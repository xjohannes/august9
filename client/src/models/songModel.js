var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	//urlRoot: '/project/' + this.projectid + '/song',
	url: function() {
		console.log(this.toJSON().projectid);
		console.log(this.toJSON().id);

		return '/project/' + encodeURIComponent(this.toJSON().projectid) + "/song/" + encodeURIComponent(this.toJSON().id);
	},
	defaults: {
		id: null,
		title: 'default title',
		projectid: null,
		projectname: 'Hip hop',
		productionstatus: 'raw',
		added: '',
		created: '',
		likes: 0,
		listens: 0,
		notes: '',
		participator: null,
		participatorRole: '',
		serverkey: '',
		influence: 'none',
		participation: 'none'
	},
	initialize: function() {
		this.listenTo(Backbone.dispacher, 'login:success', this.triggerLoginSuccess);
	},
	triggerLoginSuccess: function() {
		this.trigger('login:success');
	}
});


 
