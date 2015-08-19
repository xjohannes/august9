var Backbone = require('Backbone'),
		_ = require('underscore'),
		$ = require('jQuery'),
		UserListItemView = require('./userListItemView');

module.exports = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
		this.collection.on('remove', this.remove, this);
	},
	addOne: function(userItem) {
		//console.log("user Item : " );
		//console.log(userItem.toJSON());
		var userView = new UserListItemView({model: userItem});
		this.$el.append(userView.render().el);
	},
	addAll: function() {
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	remove: function(user) {
		//console.log("remove item from user collection view");
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	render: function() {
		this.addAll();
		//$('#sidebar').html(this.el);
		return this;
	},
	clean: function(user) {
		console.log("cleaning userCollection view");
		this.$el.empty();
	}
	
});