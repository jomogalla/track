(function(){
	'use strict';

	describe('AppCtrl', function(){
		var $controller,
			$rootScope,
			AppCtrl;

		beforeEach(function(){
			module('app');

			module(function($provide){
				$provide.value('$location', {
					path: function(string){
						return true;
					}
				});
			});

			inject(function(_$controller_, _$rootScope_){
				$controller = _$controller_;
				$rootScope = _$rootScope_;
			});
		});

		describe('user.Name', function(){
			it('should not be empty', function(){
				AppCtrl = $controller("AppCtrl");


				assert.equal($rootScope.user.Name, 'Guest');
			});
		});
	})
})();