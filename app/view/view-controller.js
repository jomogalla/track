(function(){
	'use strict';

	angular
		.module('app')
		.controller('ViewCtrl', ViewCtrl);

	ViewCtrl.$inject = ['$scope', '$routeParams', '$filter', '$location','httpService', 'FormatTime','timeEntries'];
	function ViewCtrl($scope, $routeParams, $filter, $location, httpService, FormatTime, timeEntries){

		var self = this;

		// Time Entries
		self.timeEntries = timeEntries;

		self.viewingToday = false;

		// Functions
		self.saveComment = saveComment;
		self.saveTimeIn = saveTimeIn;
		self.saveTimeOut = saveTimeOut;
		self.toggleCommentChanged = toggleCommentChanged;
		self.toggleTimeInChanged = toggleTimeInChanged;
		self.toggleTimeOutChanged = toggleTimeOutChanged;
		self.changeDate = changeDate;

		activate();

		// self.dt = new Date();
		

		// $scope.$watch('self.date', function(current, original){
		// 	var filteredDate = $filter('date')(self.date, 'M-d-yyyy');
		// 	httpService.getItem('timeEntries/date', filteredDate).then(function(timeEntries){
		// 		self.timeEntries = timeEntries;
		// 	});
		// });
		function changeDate(){
			var newDateLink = '/view/' + (self.date.getMonth()+1) + "/" + self.date.getDate() + "/" + self.date.getFullYear() + "/";
			$location.path(newDateLink);
		}
		function toggleCommentChanged(timeEntry){
			timeEntry.commentChanged = true;
		}
		function toggleTimeInChanged(timeEntry){
			timeEntry.timeInChanged = true;
		}
		function toggleTimeOutChanged(timeEntry){
			timeEntry.timeOutChanged = true;
		}
		function saveTimeIn(timeEntry){
			var formattedTimeEntry = {
				"ProjectTaskId": timeEntry.ProjectTaskId,
				"ProjectRoleId": timeEntry.ProjectRoleId,
				"TimeIn": FormatTime.formatTimeForServer(timeEntry.TimeIn),
				"Comment": timeEntry.Comment,
			};
			httpService.updateItem('TimeEntries', timeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				console.log('time in saved');
				timeEntry.timeInChanged = false;
			});
		}
		function saveTimeOut(timeEntry){
			if(timeEntry.TimeOut.getFullYear() === 1970){
				timeEntry.TimeOut.setFullYear(self.date.getFullYear());
				timeEntry.TimeOut.setMonth(self.date.getMonth());
				timeEntry.TimeOut.setDate(self.date.getDate());
			}
			var formattedTimeEntry = {
				"ProjectTaskId": timeEntry.ProjectTaskId,
				"ProjectRoleId": timeEntry.ProjectRoleId,
				"TimeIn": FormatTime.formatTimeForServer(timeEntry.TimeIn),
				"TimeOut": FormatTime.formatTimeForServer(timeEntry.TimeOut),
				"Comment": timeEntry.Comment,
			};
			httpService.updateItem('TimeEntries', timeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				console.log('time out saved');
				timeEntry.timeOutChanged = false;
			});
		}

		function saveComment(timeEntry){
			var formattedTimeEntry = {
				"ProjectTaskId": timeEntry.ProjectTaskId,
				"ProjectRoleId": timeEntry.ProjectRoleId,
				"TimeIn": FormatTime.formatTimeForServer(timeEntry.TimeIn),
				"Comment": timeEntry.Comment,
			};
			httpService.updateItem('TimeEntries', timeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				console.log('comment saved');
				timeEntry.commentChanged = false;
			});
		}

		function activate(){
			// Get the date from the URL
			if($routeParams.year){
				self.date = new Date($routeParams.year, ($routeParams.month-1), $routeParams.day);
			}
			// IF there isnt one use today
			else{
				self.date = new Date();
			}


			// Check to see if we are viewing today
			if(self.date.toDateString() === new Date().toDateString()){
				self.viewingToday = true;
			}


			// Prep for generating date links
			var nextDay = new Date();
			nextDay.setDate(self.date.getDate()+1);

			var previousDay = new Date();
			previousDay.setDate(self.date.getDate()-1);

			
			// Generate Links for tomorrow and yesterday
			self.nextDayLink = "#/view/" + (nextDay.getMonth()+1) + "/" +  nextDay.getDate() + "/" + nextDay.getFullYear() + "/";
			self.previousDayLink = "#/view/" + (previousDay.getMonth()+1) + "/" +  previousDay.getDate() + "/" + previousDay.getFullYear() + "/";

			// Format those ugly ass dates James sends us
			for(var i = 0; i < timeEntries.length; i++){
				if(self.timeEntries[i].TimeIn !== null){
					self.timeEntries[i].TimeIn = FormatTime.formatTimeFromServer(self.timeEntries[i].TimeIn);
				}
				if(self.timeEntries[i].TimeOut !== null){
					self.timeEntries[i].TimeOut = FormatTime.formatTimeFromServer(self.timeEntries[i].TimeOut);
				}
			}	
		}
	}
})();