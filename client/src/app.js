var Router     			 = require('./routesFrontEnd'),
		Backbone   			 = require('Backbone'),
		_          			 = require('underscore'),
		RoutesController = require('./routesController');


module.exports = App = function App() {};
    
App.prototype.start = function(){

Backbone.dispacher   = _.extend({}, Backbone.Events);
var originalSync     = Backbone.sync;
		routesController = new RoutesController();

routesController.initialize();

Backbone.sync = function(method, model, options) {
		if( method === 'delete' ) {
			if( options.data ) {
				options.data = JSON.stringify(options.data);
			}
			options.contentType = 'application/json';
		}

    options.headers = options.headers || {};
    _.extend(options.headers, { 'x-access-token': window.localStorage.getItem('token') });

    return originalSync.apply(this, [method, model, options]);
    //originalSync.call(model, method, model, options);
};

 this.router = new Router({controller: routesController, dispacher : Backbone.dispacher});
 this.router.start();

 Backbone.dispacher.listenTo(this.router, 'route', routesController.allRoutes);
 
};

