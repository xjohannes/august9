var Backbone     					= require('Backbone'),
		$            					= require('jQuery');

module.exports = {
	
	defaultRoute: function() {
		console.log("default Route");
		console.log("that init");
		console.log(this.that);
		console.log("this init");
		console.log(this);
		console.log("self init");
		console.log(self);
		console.log("initializing controller");
		this.self = this;
		console.log("this.self");
		console.log(this.self);
	},
	initialize: function(options) {
		console.log("that init");
		console.log(this.that);
		console.log("this init");
		console.log(this);
		console.log("self init");
		console.log(self);
		console.log("initializing controller");
		this.self = this;
		console.log("this.self");
		console.log(this.self);
		
	}
};