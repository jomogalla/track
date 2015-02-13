(function(){
	'use strict';

	angular
		.module('app')
		.controller('ViewCtrl', ViewCtrl);

	ViewCtrl.$inject = ['$scope', '$routeParams', '$filter','httpService', 'FormatTime','timeEntries'];
	function ViewCtrl($scope, $routeParams,$filter, httpService, FormatTime, timeEntries){

		var self = this;

		self.timeEntries = timeEntries;
		self.toggleCommentChanged = toggleCommentChanged;
		self.saveComment = saveComment;
		self.toggleTimeInChanged = toggleTimeInChanged;
		self.saveTimeIn = saveTimeIn;
		self.toggleTimeOutChanged = toggleTimeOutChanged;
		self.saveTimeOut = saveTimeOut;

		activate();

		// self.dt = new Date();
		

		// $scope.$watch('self.date', function(current, original){
		// 	var filteredDate = $filter('date')(self.date, 'M-d-yyyy');
		// 	httpService.getItem('timeEntries/date', filteredDate).then(function(timeEntries){
		// 		self.timeEntries = timeEntries;
		// 	});
		// });
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

		function nextDay(){
			self.date.setDate(self.date.getDate()+1);
			var filteredDate = $filter('date')(self.date, 'M-d-yyyy');

			httpService.getItem('timeEntries/date', filteredDate).then(function(timeEntries){
				for(var i = 0; i < timeEntries.length; i++){
					timeEntries[i].TimeIn = FormatTime.formatTimeFromServer(timeEntries[i].TimeIn);
					timeEntries[i].TimeOut = FormatTime.formatTimeFromServer(timeEntries[i].TimeOut);
				}
				self.timeEntries = timeEntries;
			});
		}
		function previousDay(){
			self.date.setDate(self.date.getDate()-1);
			var filteredDate = $filter('date')(self.date, 'M-d-yyyy');

			httpService.getItem('timeEntries/date', filteredDate).then(function(timeEntries){
				for(var i = 0; i < timeEntries.length; i++){
					timeEntries[i].TimeIn = FormatTime.formatTimeFromServer(timeEntries[i].TimeIn);
					timeEntries[i].TimeOut = FormatTime.formatTimeFromServer(timeEntries[i].TimeOut);
				}
				self.timeEntries = timeEntries;
			});
		}

		function activate(){
			if($routeParams.year){
				self.date = new Date($routeParams.year, ($routeParams.month-1), $routeParams.day);
			}
			else{
				self.date = new Date();
			}
			var nextDay = new Date();
			nextDay.setDate(self.date.getDate()+1);

			var previousDay = new Date();
			previousDay.setDate(self.date.getDate()-1);
			
			self.nextDayLink = "#/view/" + (nextDay.getMonth()+1) + "/" +  nextDay.getDate() + "/" + nextDay.getFullYear() + "/";
			self.previousDayLink = "#/view/" + (previousDay.getMonth()+1) + "/" +  previousDay.getDate() + "/" + previousDay.getFullYear() + "/";

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