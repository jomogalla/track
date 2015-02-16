(function(){
	'use strict';

	angular
		.module('app')
		.controller('TrackCtrl', TrackCtrl);

	TrackCtrl.$inject = ['$interval', '$filter', 'httpService', 'FormatTime', 'projects', 'timeEntries'];
	function TrackCtrl($interval, $filter, httpService, FormatTime, projects, timeEntries){
	    var self = this;
	    
	    self.projects = projects;
	    self.timeEntries = timeEntries;

	    self.initializeTracking = initializeTracking;
	    self.stopTracking = stopTracking;
	    self.saveComment = saveComment;
	    self.toggleTracking = toggleTracking;

	    activate();	
	    // reInitializeTracking();  

	    function toggleTracking(task, project){
	    	if(task.currentlyTracking){
	    		// console.log('stop tracking');
	    		stopTracking(task);
	    	}
	    	else{
	    		// console.log('start trackings');
	    		initializeTracking(task, project);
	    	}
	    }

	    function activate(){
			// Grab all the time entries -- 
			for(var i = 0; i < timeEntries.length; i++){
				if(self.timeEntries[i].TimeIn !== null){
					self.timeEntries[i].TimeIn = FormatTime.formatTimeFromServer(self.timeEntries[i].TimeIn);
				}
				if(self.timeEntries[i].TimeOut !== null){
					self.timeEntries[i].TimeOut = FormatTime.formatTimeFromServer(self.timeEntries[i].TimeOut);
				}
			}
			reInitializeTracking();

		}  
		function saveComment(task){
			var formattedTimeEntry = {
				"ProjectTaskId": task.runningTimeEntry.ProjectTaskId,
				"ProjectRoleId": task.runningTimeEntry.ProjectRoleId,
				"TimeIn": FormatTime.formatTimeForServer(task.runningTimeEntry.TimeIn),
				"Comment": task.runningTimeEntry.Comment,
			};

			httpService.updateItem('TimeEntries', task.runningTimeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				console.log('comment saved');
			});
		}

		function initializeTracking(task, project){
			var startTime = new Date();

			var defaultRole = project.ProjectRoles[0];

			task.runningTimeEntry = {
	            ProjectRoleId: defaultRole.ProjectRoleId,
				ProjectTaskId: task.ProjectTaskId,
				Billable: task.Billable,
				TimeIn:  startTime,
				TimeOut: undefined,
	            Comment: "",
	            Hours: "", 
	            TimeEntryId: undefined,
	        };
			
			// var formattedTime = $filter('date')(startTime, 'M/d/yyyy hh:mma');
			var formattedTime = FormatTime.formatTimeForServer(startTime);

			if(self.activeTask){
				if(self.activeTask.currentlyTracking){
					stopTracking(self.activeTask);
				}
			}

			startClock(task);

			var formattedTimeEntry = {
				"ProjectRoleId": defaultRole.ProjectRoleId,
				"ProjectTaskId": task.ProjectTaskId,
				"Billable": task.Billable,
				"TimeIn":  formattedTime,
				"TimeOut": undefined,
	            "Comment": undefined,
			};

			httpService.createItem('TimeEntries', formattedTimeEntry).then(function(data) {
				console.log('time entry started');
				task.runningTimeEntry.TimeEntryId = data.TimeEntryId;
			});
		}
		
		function stopTracking(task){
			var currentTime = new Date();
			
			task.currentlyTracking = false;

			console.log("stopping time");

			$interval.cancel(task.currentInterval);


			var formattedTimeEntry = {
				"ProjectTaskId": task.runningTimeEntry.ProjectTaskId,
				"ProjectRoleId": task.runningTimeEntry.ProjectRoleId,
				"TimeIn": FormatTime.formatTimeForServer(task.runningTimeEntry.TimeIn),
				"TimeOut": FormatTime.formatTimeForServer(currentTime),
				"Comment": task.runningTimeEntry.Comment,
			};
			// self.activeTask = {};

	  		httpService.updateItem('TimeEntries', task.runningTimeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				// nuke the newTimeEntry
				
				// task.newTimeEntry = {};
			});
		}

		function startClock(task){
			self.activeTask = task;
			task.currentlyTracking = true;
			updateTimer(task);
			task.currentInterval = $interval(function(){updateTimer(task);}, 1000);
				
		}
		function updateTimer(task){
			var currentTime = new Date();
			var timeDifference = currentTime - task.runningTimeEntry.TimeIn;

			task.runningTimeEntry.Hours = timeDifference;
		}

		function reInitializeTracking(){
			for(var i = 0; i < self.timeEntries.length; i++){
				if(self.timeEntries[i].TimeOut === null){
					self.timeEntries[i].isInTrackingMode = true;



					var runningTask = findTaskById(self.timeEntries[i].ProjectTaskId);
					// find this timeentries task
					// hook it on as newTimeEntry
					// then starttiming
					runningTask.runningTimeEntry = self.timeEntries[i];

					startClock(runningTask);

				}
			}
		}

		function findTaskById(id){
			for(var j = 0; j < self.projects.length; j++){
				for(var k = 0; k < self.projects[j].ProjectTasks.length; k++){
					if(self.projects[j].ProjectTasks[k].ProjectTaskId === id){
						return self.projects[j].ProjectTasks[k];
					}
				}
			}
		}
	}
})();