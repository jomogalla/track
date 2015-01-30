(function () {
  'use strict';
  
  angular.module('app', ['ui.bootstrap']);
  
  angular.module('app')
    .controller('TimeTrack', TimeTrack)
    .controller('ModalAddTaskCtrl', ModalAddTaskCtrl);
  
  TimeTrack.$inject = ['$http', '$modal', '$filter', '$interval'];
  function TimeTrack ($http, $modal, $filter, $interval) {
  	var authStr = btoa('jasonstest:jason');

  	// Setting Authentication Header
	$http.defaults.headers.common.Authorization = 'Basic ' + authStr;



    var self = this;
    
    // Grab the projects 
    self.projects = [];
    self.tasks = [];
    self.timeEntries = [];

    // Grab all the projects -- 
    $http.get('https://csgprohackathonapi.azurewebsites.net/api/Projects').then(function(response){
    	self.projects = response.data;
    });

    // Grab all the entries
    $http.get('https://csgprohackathonapi.azurewebsites.net/api/TimeEntries').then(function(response){
    	console.log(response);
    	self.timeEntries = response.data;
    	console.log(self.timeEntries);
    });

    self.roles = [];

    self.addProject = function(project) {
		// Then change it if we actually get any data
		var newProject = {
			"Name":"Project " + (self.projects.length+1),
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
		if(typeof project !== 'undefined'){
			newProject.Name = angular.copy(project.Name);
		}
      	$http.post('https://csgprohackathonapi.azurewebsites.net/api/Projects', newProject).
  			success(function(data, status, headers, config) {
    			console.log(data);
  			}).
  			error(function(data, status, headers, config) {
    			console.log(data);	
  			});
    };
    
    self.addTask = function(project) {
    	// do a modal here
		
	    var modalInstance = $modal.open({
	    	templateUrl: 'modal-add-task.html',
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
    self.addRole = function(parentProject) {
    	// do a modal here
   		var newRole = {id:(self.roles.length+1), ProjectId: parentProject.ProjectId, Name:"Role " + (self.roles.length+1)};;
      	self.roles.push(newRole);
    };

    // Change to a toggleTracking - make the whole row clickable, and depending on the state of 
    // isInTrackingMode, starts or stops the task
    self.toggleTracking = function(task, project){
    	// if we are not tracking, start a new Time Entry

    	if(!task.newTimeEntry.isInTrackingMode || typeof task.newTimeEntry == 'undefined'){
    		var startTime = new Date();

			console.log("starting time");


			// should check if this exists
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


			task.currentInterval = $interval(function(){
				var currentTime = new Date();
				var timeDifference = currentTime - task.newTimeEntry.TimeIn;
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
			
			// console.log(self.newTimeEntry);

			// Post everything now, when they hit stop, use a put to push the timeout and possibly comment
			// if they just start another 


			// $http.post('https://csgprohackathonapi.azurewebsites.net/api/Projects', newTimeEntry).
	  // 			success(function(data, status, headers, config) {
	  //   			console.log(data);
	  // 			}).
	  // 			error(function(data, status, headers, config) {
	  //   			console.log(data);	
	  // 			});


    	}
    	// if we are tracking, stop the current Time Entry
    	else{
    		var currentTime = $filter('date')(new Date(), 'M/d/yyyy hh:mma');
		
			var defaultRole = project.ProjectRoles[0];

			task.newTimeEntry.isInTrackingMode = false;

			console.log("stopping time");

			$interval.cancel(task.currentInterval);
    	}
    };

    // on initialization 
	self.startTracking = function(task, project){
		var startTime = new Date();

		console.log("starting time");


		// should check if this exists
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
		

		// console.log(self.newTimeEntry);

		// Post everything now, when they hit stop, use a put to push the timeout and possibly comment
		// if they just start another 

		var formattedTimeEntry = {
			"ProjectRoleId": defaultRole.ProjectRoleId,
			"ProjectTaskId": task.ProjectTaskId,
			"Billable": task.Billable,
			"TimeIn":  formattedTime,
			"TimeOut": undefined,
            "Comment": undefined,
		}
		// console.log(formattedTimeEntry);

		$http.post('https://csgprohackathonapi.azurewebsites.net/api/TimeEntries', formattedTimeEntry).
  			success(function(data, status, headers, config) {
  				task.newTimeEntry.TimeEntryId = data.TimeEntryId;
  			}).
  			error(function(data, status, headers, config) {
    			console.log(data);	
  			});


	};
	self.stopTracking = function(task, project){
		var currentTime = $filter('date')(new Date(), 'M/d/yyyy hh:mma');
		
		var defaultRole = project.ProjectRoles[0];

		task.newTimeEntry.isInTrackingMode = false;

		console.log("stopping time");

		$interval.cancel(task.currentInterval);
		// var newTimeEntry = {
		// 	ProjectRoleId: defaultRole.ProjectRoleId,
		// 	ProjectTaskId: task.ProjectTaskId,
		// 	Billable: task.Billable,
		// 	TimeOut:  currentTime,
		// }

		// Set up an interval of 1s that calculates the time since ^ timeIn - then simply displays this on the task

		// console.log(newTimeEntry);
		// $http.post('https://csgprohackathonapi.azurewebsites.net/api/Projects', newTimeEntry).
  // 			success(function(data, status, headers, config) {
  //   			console.log(data);
  // 			}).
  // 			error(function(data, status, headers, config) {
  //   			console.log(data);	
  // 			});

		// FIRST THING TO DO - just get a damn stopwatch to appear from the time when the user clicked the project

		// if someone hits stop, update with a TimeOut
		// otherwise - if they hit start on another project, do nothing.
		// destroy interval instance


	}
	self.openAddProjectTask = function(){

	};
	// self.toggleTracking = function (project){
	// 	self.currentTime = new Date();
	// 	console.log(self.currentTime);
	// };
  };

  function ModalAddTaskCtrl ($modalInstance, $http, project){
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

   		// Now that the Task is all cleaned up, send it to the server
  		$http.post('https://csgprohackathonapi.azurewebsites.net/api/ProjectTasks', newTask).
  			success(function(data, status, headers, config) {
    			$modalInstance.close(data)
  			}).
  			error(function(data, status, headers, config) {
  				console.log(data);
  			});
  	};

  	modalVM.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
  };


})();