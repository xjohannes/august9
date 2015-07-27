var Song = Backbone.Model.extend({
	urlRoot: '/song',
	defaults: {
		title: '',
		projectid: '',
		hasProductionStatus: '',
		added: '',
		created: '',
		likes: 0,
		listens: 0,
		notes: 'no notes',
		serverKey: ''
	}
});