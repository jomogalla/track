(function(){
	'use strict';

	angular
		.module('app')
		.controller('NavBarCtrl', NavBarCtrl);

	NavBarCtrl.$inject = ['$location'];
	function NavBarCtrl($location){
		self = this;

		self.isActive = isActive;

		function isActive(path){
			return path === $location.path().replace("/", "");
		}
	}
})();