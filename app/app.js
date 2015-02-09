(function () {
	'use strict';
  
	angular.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'angular-loading-bar'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					redirectTo: '/track',
				})
				.when('/track', {
					templateUrl : 'track/track.html',
					controller: 'TrackCtrl',
					controllerAs: 'vm',
				})
				.when('/manage', {
					templateUrl : 'manage/manage.html',
					controller: 'ManageCtrl',
					controllerAs: 'vm',
				})
				.when('/view', {
					templateUrl : 'view/view.html',
					controller: 'ViewCtrl',
					controllerAs: 'vm',
				})
				.when('/login', {
					templateUrl : 'login/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'vm',
				})
				.otherwise({
					redirectTo: '/track'
				});
		});
})();