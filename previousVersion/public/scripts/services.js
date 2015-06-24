(function () {
	'use strict';

/* Services */

var august9Services = angular.module('august9Services', ['ngResource']);

// Using $resource
august9Services.factory('Singer', ['$resource',
  function($resource){

    return {'track1': 'I WILL find you (vidar)',
            'track2': 'twilightVidarMusikmakarna',
            'track3': '7aa4d0a787ca92e67d97e70b47e238ce'};
  }]);


/*
// Using $http
august9Services.factory('Genome', ['$http',
  function($http){

    return $http.get('https://hyperbrowser.uio.no/wizard/hyper/json'
      + '?module=jsongui&method=getAllGenomes');
  }]);
*/

august9Services.factory('Electro', ['$resource',
  function($resource){
    return {'track1': 'kuldeSjokk',
            'track2': 'hotel_boryfsen'};
  }]);

august9Services.factory('singer', ['$resource',
  function($resource){

    return {'track1': 'I WILL find you (vidar)',
            'track2': 'twilightVidarMusikmakarna'};
  }]);

// End
}());

