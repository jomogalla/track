(function(){
	'use strict';

	angular
		.module('app')
		.factory('FormatTime', FormatTime);

	FormatTime.$inject = ['$filter'];
	function FormatTime($filter){
		var service = {
			formatTimeFromServer:formatTimeFromServer,
			formatTimeForServer:formatTimeForServer,
		};

		return service;

		function formatTimeForServer(time){
			return $filter('date')(time, 'M/d/yyyy hh:mma');
		}
		function formatTimeFromServer(time){
			var splitTime = time.split(/[:T-]/);
	  		var useableDate = new Date(splitTime[0], splitTime[1]-1, splitTime[2], splitTime[3], splitTime[4], splitTime[5]);
	  		return useableDate;
		}
	}
})();