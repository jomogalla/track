(function () {
	'use strict';
  
	angular.module('app', ['ui.bootstrap', 'ngRoute'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl : 'track.html',
				})
				.when('/track', {
					templateUrl : 'track.html',
				})
				.when('/manage', {
					templateUrl : 'edit.html',
				})
				.when('/view', {
					templateUrl : 'view.html',
				});
		  });

	angular.module('app')
		.controller('TimeTrack', TimeTrack)
    	.controller('ModalAddTaskCtrl', ModalAddTaskCtrl)
    	.controller('ModalAddProjectCtrl', ModalAddProjectCtrl);
  
	TimeTrack.$inject = ['$http', '$modal', '$filter', '$interval', 'httpService'];
	function TimeTrack ($http, $modal, $filter,  $interval, httpService) {
  		var authStr = btoa('jasonstest2:jason');

	  	// Setting Authentication Header
		$http.defaults.headers.common.Authorization = 'Basic ' + authStr;



		var halfLoaded = false;
	    var self = this;
	    
	    self.projects = [];
	    self.tasks = [];
	    self.timeEntries = [];

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
				if(self.timeEntries[i].TimeIn != null){
					self.timeEntries[i].TimeIn = formatTimeFromServer(self.timeEntries[i].TimeIn);
				}
				if(self.timeEntries[i].TimeOut != null){
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

	    self.addProject = function() {

	    	var modalInstance = $modal.open({
		    	templateUrl: './modal-add-project.html',
		    	controller: 'ModalAddProjectCtrl',
		    	controllerAs: 'modalVM',

		    });

		    modalInstance.result.then(function (newProject) {
				self.projects.push(newProject);
			});
		};

		self.toggleArchive = function(project){
			project.Archived = !project.Archived;

			var updatedProject = {
					"Name": project.Name,
					"Archived": project.Archived
			};

			httpService.updateItem('Projects', project.ProjectId, updatedProject).then(function(data) {
				console.log('Project Updated');
			});
		};
	    
	    self.addTask = function(project) {

		    var modalInstance = $modal.open({
		    	templateUrl: './modal-add-task.html',
		    	controller: 'ModalAddTaskCtrl',
		    	controllerAs: 'modalVM',
		    	resolve: {
		        	project: function () {
		        		return project;
		        	}
		      	}
		    });

		    modalInstance.result.then(function (newTask) {
				project.ProjectTasks.push(newTask);
			});
	    };

		self.startTracking = function(task, project){
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


			self.startClock(task);

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
		self.startClock = function(task){
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
		};
		self.stopClock = function(timeEntry){
			var currentTime = new Date();
			
			var defaultRole = project.ProjectRoles[0];

			task.newTimeEntry.isInTrackingMode = false;

			console.log("stopping time");

			$interval.cancel(task.currentInterval);
		};
		self.stopTracking = function(task, project){
			var currentTime = new Date();
			
			var defaultRole = project.ProjectRoles[0];

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
		};
		self.toggleBillable = function(task, project){
			task.Billable = !task.Billable;

			var cleanedTask = {
				"ProjectId": project.ProjectId,
				"Name": task.Name,
				"Billable": task.Billable,
			};

			httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTask).then(function(data) {
				console.log('Task billing status updated');
			});
		};
		self.toggleCommentRequirement = function(task, project){
			task.RequireComment = !task.RequireComment;

			var cleanedTask = {
				"ProjectId": project.ProjectId,
				"Name": task.Name,
				"RequireComment": task.RequireComment,
			};

			httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTask).then(function(data) {
				console.log('Task comment requirement status updated');
			});
		};
		self.deleteTask = function(task, project, idx){
			httpService.deleteItem('ProjectTasks', task.ProjectTaskId).then(function(data) {
				project.ProjectTasks.splice(idx, 1);
			});
		}
		self.renameTask = function(task, project, keypress){
			if(keypress.keyCode == 13){
				task.isRenaming = false;

				var cleanedTask = {
					'Name': task.Name,
					'ProjectId': project.ProjectId,
				}

				httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTask).then(function(data) {
					console.log('Task name updated');
				});
			}
		}
		function restartRunningTimeEntry(){
			for(var i = 0; i < self.timeEntries.length; i++){
				if(self.timeEntries[i].TimeOut == null){
					self.timeEntries[i].isInTrackingMode = true;



					var activeTask = findTaskById(self.timeEntries[i].ProjectTaskId)
					// find this timeentries task
					// hook it on as newTimeEntry
					// then starttiming
					activeTask.newTimeEntry = self.timeEntries[i];
					self.startClock(activeTask);

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
	  		var useableDate = new Date(splitTime[0], splitTime[1]-1, splitTime[2], splitTime[3], splitTime[4], splitTime[5])
	  		return useableDate;
	  	}
	}

  
	function ModalAddTaskCtrl ($modalInstance, $http, project, httpService){
	  	var modalVM = this;

	  	modalVM.project = project;

	  	modalVM.add = function () {

			var newTask = {
	   			Name: modalVM.Name,
	   			ProjectId: modalVM.project.ProjectId,
	   			Billable: modalVM.Billable,
	   			RequireComment: modalVM.RequireComment, 
	   		};

	   		// if properties are undefined, fix that here
	   		if(typeof newTask.Name === 'undefined'){
	   			newTask.Name = "Unnamed";
	   		}
	   		if(typeof newTask.Billable === 'undefined'){
	   			newTask.Billable = false;
	   		}
	   		if(typeof newTask.RequireComment === 'undefined'){
	   			newTask.RequireComment = false;
	   		}

	   		// httpService.createItem(){

	   		// }
	   		// Now that the Task is all cleaned up, send it to the server
	   		httpService.createItem('ProjectTasks', newTask).then(function(data) {
				$modalInstance.close(data);
			});
	  	};

	  	modalVM.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
  	function ModalAddProjectCtrl ($modalInstance, $http){
		var modalVM = this;


	  	modalVM.add = function () {
	  		
			var newProject = {
				"Name": modalVM.Name,
				"ExternalSystemKey": "no key",
				"Archived": false,
				"ProjectRoles": [
				    {
				      "Name": "default",
				      "ExternalSystemKey": "no key"
				    },
				],
			  	"ProjectTasks": [
				    {
				      "Name": "default",
				      "Billable": false,
				      "RequireComment": false,
				      "ExternalSystemKey": "no key"
				    },
				]
			};

			// Checking and correcting undefined values
			if(typeof newProject.Name === 'undefined'){
				modalVM.Name = "Default" ;
			}
			
			httpService.createItem('Projects', newProject).then(function(data) {
				$modalInstance.close(newProject);
			});
		};
		modalVM.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
})();