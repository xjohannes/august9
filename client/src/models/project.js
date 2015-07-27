var Project = Backbone.Model.extend({
	urlRoot: '/pjoject',
	defaults: {
		projectname: '',
		email: ''
	}
});

var houseMusic = new Project();

var projectDetails = {
	projectname: 'House',
	email: 'house.vidar.akse@gmail.com'
};