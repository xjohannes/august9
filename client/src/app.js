var Router = require('./routesFrontEnd'),
		Backbone = require('Backbone'),
		_ = require('underscore');


module.exports = App = function App() {};
    
App.prototype.start = function(){

//Backbone.dispacher = _.clone(Backbone.Events);

Backbone.dispacher = _({}).extend(Backbone.Events);
 
var originalSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    options.headers = options.headers || {};
    _.extend(options.headers, { 'x-access-token': window.localStorage.getItem('token') });
    originalSync.call(model, method, model, options);
};
 this.router = new Router();
 this.router.start();
 
};

