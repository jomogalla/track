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
			logout:logout,
			resetUser:resetUser,
		};

		return service;

		function login(username,password) {
			if(!username || !password) {
				if($cookieStore.get('authdata')) {
					httpService.getCollection('users').then(function(user) {
						$rootScope.user = user;
						$rootScope.loggedUser = true;
						// Redirect to home
						var currentLoc = $location.path();
						if(currentLoc === '/login' || currentLoc === '/signup') {
							$location.path('/');
						}
					});
				} 
				else {
					$location.path('/login');
				}
			} 
			else {
				username = saltUserName(username);
				Auth.setCredentials(username,password);
				login();
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