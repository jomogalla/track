(function(){
	'use strict';

	describe('TrackCtrl', function(){
		var $controller,
			$rootScope,b fsb 
			TrackCtrl;

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

		// describe('finding task by id', function(){
		// 	it('should return us a task', function(){
		// 		TrackCtrl = $controller("TrackCtrl");


		// 		assert.equal($rootScope.user.Name, 'Kendo');
		// 	});
		// });
		describe('Initialize Tracking', function(){
			it('should set task currently tracking to true', function(){
				TrackCtrl = $controller("TrackCtrl");


				assert.equal($rootScope.user.Name, 'Kendo');
			});
		});
	});
})();