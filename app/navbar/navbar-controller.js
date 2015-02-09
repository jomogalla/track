(function(){
	'use strict';

	angular
		.module('app')
		.controller('NavBarCtrl', NavBarCtrl);

	NavBarCtrl.$inject = ['$location', '$cookieStore', '$rootScope','UserServices', 'Auth'];
	function NavBarCtrl($location, $cookieStore, $rootScope, UserServices, Auth){
		self = this;

		self.isActive = isActive;
		self.logout = logout;


		$rootScope.$watch('user', function(){
			self.user = $rootScope.user.UserName;
		});

		
		function logout(){
			UserServices.logout();
			$location.url('/');
		}

		function isActive(path){
			return path === $location.path().replace("/", "");
		}
	}
})();