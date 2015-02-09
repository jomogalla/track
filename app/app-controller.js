(function(){
	'use strict';

	angular
		.module('app')
		.controller('AppCtrl', AppCtrl)
		.run(runBlock);

	AppCtrl.$inject = ['httpService'];
	function AppCtrl (httpService){
		
	}
	runBlock.$inject = ['$rootScope', '$location', '$cookieStore', 'UserServices'];
	function runBlock ($rootScope, $location, $cookieStore, UserServices){
		UserServices.resetUser();

		$rootScope.loggedUser = false;
		$rootScope.user.Name = 'Guest';

		// Check if cookie exists
		if ($cookieStore.get('authdata')) {
			// login user
			UserServices.login();
		}
		$rootScope.$on('$routeChangeStart', function(questionable, next){
			// they are logged
			if($rootScope.loggedUser || $cookieStore.get('authdata')){
				// dont let them go to the login page
				if(next.templateUrl === 'login/login.html'){
					$location.path('/track');
				}
			}
			// if they arent logged in send them to login
			else{
				$location.path('/login');
			}
			
		});
	}
})();