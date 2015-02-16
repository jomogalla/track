(function(){
	'use strict';

	angular
		.module('app')
		.controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['$cookieStore', 'Auth', '$location','UserServices'];
	function LoginCtrl($cookieStore, Auth, $location, UserServices){
		var self = this;

		self.login = login;

		function login(credentials){
			UserServices.login(credentials.username, credentials.password).then(function(valid){
				if(valid){
					Auth.setCredentials(credentials.username, credentials.password);
					console.log('we logged in!');
					if($location.path() === '/login') {
						$location.path('/');
					}
				}
				else{
					console.log('we failded');

				}
			});
		}
	}	
})();