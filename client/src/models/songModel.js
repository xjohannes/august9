var Backbone = require('Backbone');

module.exports = Backbone.Model.extend({
	urlRoot: '/project/:projectid/song/',
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


 
