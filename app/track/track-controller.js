(function(){
	'use strict';

	angular
		.module('app')
		.controller('TrackCtrl', TrackCtrl);

	TrackCtrl.$inject = ['$interval', '$filter','httpService'];
	function TrackCtrl($interval, $filter, httpService){
	    var self = this;
	    
	    self.projects = [];
	    self.timeEntries = [];

	    self.startTracking = startTracking;
	    self.stopTracking = stopTracking;

	    activate();
	    

		function startTracking(task, project){
			var startTime = new Date();

			// should check if this exists, if it doesnt, create one
			var defaultRole = project.ProjectRoles[0];

			// Well shit - this shouldnt create a new one every time if the person has already started a timeentry on 
			// this task
			// basoically if this task has a time entry that has no timeout - continue where they left off?
			// otherwise make a new one!!! 

			task.newTimeEntry = {
	            ProjectRoleId: defaultRole.ProjectRoleId,
				ProjectTaskId: task.ProjectTaskId,
				Billable: task.Billable,
				TimeIn:  startTime,
				TimeOut: undefined,
	            Comment: "",
	            isInTrackingMode: true,
	            Hours: "", 
	            TimeEntryId: undefined,
	        };
			
			var formattedTime = $filter('date')(startTime, 'M/d/yyyy hh:mma');

			// var currentTime = new Date();
			// console.log($filter('date')((currentTime - task.newTimeEntry.TimeIn), 'hh:mm:ss'));


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
				task.newTimeEntry.TimeEntryId = data.TimeEntryId;
			});
		};
		
		function stopTracking(task){
			var currentTime = new Date();
			

			task.newTimeEntry.isInTrackingMode = false;

			console.log("stopping time");

			$interval.cancel(task.currentInterval);

			// console.log(formatTimeForServer(task.newTimeEntry.TimeIn));
			// console.log(currentTime);


			var formattedTimeEntry = {
				"ProjectTaskId": task.newTimeEntry.ProjectTaskId,
				"ProjectRoleId": task.newTimeEntry.ProjectRoleId,
				"TimeIn": formatTimeForServer(task.newTimeEntry.TimeIn),
				"TimeOut": formatTimeForServer(currentTime),
				"Comment": task.newTimeEntry.Comment,
			};

	  		httpService.updateItem('TimeEntries', task.newTimeEntry.TimeEntryId, formattedTimeEntry).then(function(data) {
				self.timeEntries.push(task.newTimeEntry);
			});
		}
		function activate(){
			var halfLoaded = false;

			httpService.setAuthHeader();

			// Grab all the projects -- 
	    	httpService.getCollection('projects').then(function(projects) {
				self.projects = projects;
				if(halfLoaded){
					restartRunningTimeEntry();
				}
				else{
					halfLoaded = true;
				}
			});

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
				if(halfLoaded){
					restartRunningTimeEntry();
				}
				else{
					halfLoaded = true;
				}
			});

		}

		function startClock(task){
			task.currentInterval = $interval(function(){
				var currentTime = new Date();
				var timeDifference = currentTime - task.newTimeEntry.TimeIn;

				// if statements for just pretty up the display of time
				if(timeDifference < 60000){
					task.newTimeEntry.Hours = $filter('date')(timeDifference, 's');
				}
				else if(timeDifference < 3600000){
					task.newTimeEntry.Hours = $filter('date')(timeDifference, 'm:ss');
				}
				else{
					task.newTimeEntry.Hours = $filter('date')(timeDifference, 'h:mm:ss');
				}
				
			}, 1000);
		}

		function stopClock(task){			
			task.newTimeEntry.isInTrackingMode = false;

			console.log("stopping time");

			$interval.cancel(task.currentInterval);
		}

		function restartRunningTimeEntry(){
			for(var i = 0; i < self.timeEntries.length; i++){
				if(self.timeEntries[i].TimeOut === null){
					self.timeEntries[i].isInTrackingMode = true;



					var activeTask = findTaskById(self.timeEntries[i].ProjectTaskId);
					// find this timeentries task
					// hook it on as newTimeEntry
					// then starttiming
					activeTask.newTimeEntry = self.timeEntries[i];
					startClock(activeTask);

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