(function(){
	'use strict';

	angular
		.module('app')
		.controller('ViewCtrl', ViewCtrl);

	ViewCtrl.$inject = ['httpService'];
	function ViewCtrl(httpService){

		var self = this;

		self.timeEntries = [];

		activate();

		function activate(){
			// Grab all the time entries -- 
		    httpService.getCollection('timeEntries').then(function(timeEntries) {
				self.timeEntries = timeEntries;

				for(var i = 0; i < timeEntries.length; i++){
					if(self.timeEntries[i].TimeIn !== null){
						self.timeEntries[i].TimeIn = formatTimeFromServer(self.timeEntries[i].TimeIn);
					}
					if(self.timeEntries[i].TimeOut !== null){
						self.timeEntries[i].TimeOut = formatTimeFromServer(self.timeEntries[i].TimeOut);
					}
				}
			});		
		}
		function formatTimeFromServer(time){
		  		var splitTime = time.split(/[:T-]/);
		  		var useableDate = new Date(splitTime[0], splitTime[1]-1, splitTime[2], splitTime[3], splitTime[4], splitTime[5]);
		  		return useableDate;
		}	
	}
})();