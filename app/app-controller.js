(function(){
	'use strict';

	angular
		.module('app')
		.controller('AppCtrl', AppCtrl);

	AppCtrl.$inject = ['$rootScope', '$auth', 'httpService'];
	function AppCtrl ($rootScope, $auth, httpService){
		httpService.setAuthHeader();
	}


})();