(function () {
	'use strict';
  
	angular.module('app', ['ui.bootstrap', 'ngRoute'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl : 'track.html',
				})
				.when('/track', {
					templateUrl : 'track/track.html',
					controller: 'TrackCtrl',
					controllerAs: 'vm',
				})
				.when('/manage', {
					templateUrl : 'edit.html',
				})
				.when('/view', {
					templateUrl : 'view.html',
				});
	});
});