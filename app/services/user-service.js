// Originally by @kenhowardpdx

(function() {
	'use strict';
	angular
		.module('app')
		.factory('UserServices', UserServices);

	UserServices.$inject = ['Auth', '$cookieStore', '$rootScope', 'httpService', '$location'];
	function UserServices(Auth, $cookieStore, $rootScope, httpService, $location){

		var self = this;

		var service = {
			login:login,
			restoreUser:restoreUser,
			logout:logout,
			resetUser:resetUser,
		};

		return service;

		function login(username,password) {
			Auth.setCredentials(username,password);

			return httpService.getCollection('users').then(function(user) {
				if(user){
					$rootScope.user = user;
					$rootScope.loggedUser = true;
					return true;
				}
				else{
					Auth.clearCredentials();
					return false;
				}
			});
		}
		function restoreUser(){
			if($cookieStore.get('authdata')){
				httpService.getCollection('users').then(function(user) {
					$rootScope.user = user;
					$rootScope.loggedUser = true;
				});
			}
		}
		function logout() {
			Auth.clearCredentials();
			resetUser();

			// Redirect to login
			$location.path('/login');
		}

		function resetUser() {
			$rootScope.user = {
				Email: '',
				ExternalSystemKey: null,
				Name: 'Guest',
				TimeZoneId: '',
				UseStopwatchApproachToTimeEntry: false,
				UserId: 0,
				UserName: ''
			};
			$rootScope.loggedUser = false;
		}
		function saltUserName(username) {
			// return CONFIG.USERNAME_PREFIX + username;
			return username;
		}
	}
})();