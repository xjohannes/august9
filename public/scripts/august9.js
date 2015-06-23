/* August 9 main js file
*
*
*/
(function () {
'use strict';
var august9 = angular.module('august9', ['MockServer', 
	'ui.router', 'ngResource', 'august9Services']);


august9.config( function( $provide, $stateProvider, $urlRouterProvider ) {
	//$urlRouterProvider.otherwise("/");

	
		
//This works
	$stateProvider
		 // HOME STATES AND NESTED VIEWS ========================================
    .state('home/', {
        url: '/',
        templateUrl: './partials/home.html'
    })
  
		.state('genre', {
			url: "/:genre/:track",
			views: {
				"": {templateUrl: "./partials/genre.html",
							controller: function ($scope , $stateParams, Singer, Electro, $state ) {
								$scope.tracks = ($stateParams.genre === 'singer' ? Singer : Electro);
								$scope.selectedGenre = $stateParams.genre;
								$scope.selectedTrack = "../media/music/" + $scope.selectedGenre 
								+ '/' + $stateParams.track;
							}},
				"playerView": {
					templateUrl:'./partials/playerView.html',
					controller: function ($scope, $stateParams) {
						$scope.selectedTrack = "../media/music/" + $stateParams.genre 
								+ '/' + $stateParams.track + '.mp3';
						console.log("genre State: " + $scope.selectedTrack);
					} 
				},
				"trackStats": {templateUrl: "./partials/trackStats.html"},
				"trackComments": {templateUrl: "./partials/trackComments.html"}
			}
		})
		.state('upload', {
			url: "/upload",
			templateUrl: "./partials/uploadTrack.html"
		})
		;
	});	


// End outer wrapper function
}());