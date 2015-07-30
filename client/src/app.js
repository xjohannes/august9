var Router = require('./routesFrontEnd');
var Backbone = require('Backbone');


module.exports = App = function App() {};
    
App.prototype.start = function(){
 
 var router = new Router();
 router.start();
 
};

