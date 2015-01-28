(function() {
	'use strict';

	angular.module('app')
		.controller('AddTaskModalCtrl', function ('$modalInstance') {

			var modalVM = this;

			

			

			modalVM.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
	});
})();