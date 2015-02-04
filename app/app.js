(function () {
	'use strict';
  
	angular.module('app', ['ui.bootstrap', 'ngRoute', 'satellizer'])
		.config(function($routeProvider, $authProvider){
			$routeProvider
				.when('/', {
					templateUrl : 'track/track.html',
					controller: 'TrackCtrl',
					controllerAs: 'vm',
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
					// controller: 'ViewCtrl',
					// controllerAs: 'vm',
				});
		});
})();