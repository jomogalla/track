(function(){
	'use strict';

	angular
		.module('app')
		.controller('LoginCtrl', LoginCtrl);

	LoginCtrl.$inject = ['UserServices'];
	function LoginCtrl(UserServices){
		var self = this;

		self.login = login;

		function login(credentials){
			UserServices.login(credentials.username, credentials.password);
		}
	}	
})();