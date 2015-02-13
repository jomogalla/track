(function () {
	'use strict';
  
	angular
		.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'angular-loading-bar', 'timeFilters', 'myComment'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					redirectTo: '/track',
				})
				.when('/track', {
					templateUrl : 'track/track.html',
					controller: 'TrackCtrl',
					controllerAs: 'vm',
					resolve: {
						projects: ['httpService', function(httpService){
							return httpService.getCollection('projects');
						}],
						timeEntries: ['httpService', function(httpService){
							return httpService.getCollection('timeEntries');
							// return true;
						}]
					}
				})
				.when('/manage', {
					templateUrl : 'manage/manage.html',
					controller: 'ManageCtrl',
					controllerAs: 'vm',
					resolve: {
						projects: ['httpService', function(httpService){
							return httpService.getCollection('projects');
						}],
					}
				})
				.when('/view', {
					templateUrl : 'view/view.html',
					controller: 'ViewCtrl',
					controllerAs: 'vm',
					resolve: {
						timeEntries: ['httpService', function(httpService){
							return httpService.getCollection('timeEntries');
						}]
					}
				})
				.when('/view/:month/:day/:year/', {
					templateUrl : 'view/view.html',
					controller: 'ViewCtrl',
					controllerAs: 'vm',
					resolve: {
						timeEntries: ['httpService', '$route', function(httpService, $route){
							var filteredDate = $route.current.params.month + "-" + $route.current.params.day + "-" + $route.current.params.year;
							return httpService.getItem('timeEntries/date', filteredDate);
						}]
					}
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