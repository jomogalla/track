(function(){
	'use strict';

	angular
		.module('app')
		.controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['$cookieStore', 'Auth', '$location', 'UserServices'];
	function LoginCtrl($cookieStore, Auth, $location, UserServices){
		var self = this;

		self.login = login;

		function login(credentials){
			if(credentials.username && credentials.password){
				UserServices.login(credentials.username, credentials.password).then(function(valid){
					if(valid){
						Auth.setCredentials(credentials.username, credentials.password);
						if($location.path() === '/login') {
							$location.path('/');
						}
					}
					else{
						console.log('we failded');
						self.invalidCredentials = true;
					}
				});
			}
			else{
				console.log("not enough credentials");
			}
		}
	}	
})();