(function () {
  'use strict';
  
  angular.module('app', ['ui.bootstrap']);
  
  angular.module('app')
    .controller('TimeTrack', TimeTrack)
    .controller('ModalAddTaskCtrl', ModalAddTaskCtrl)
    .directive('DoTimeStuff', DoTimeStuff);
  
  TimeTrack.$inject = ['$http', '$modal'];
  function TimeTrack ($http, $modal) {
  	var authStr = btoa('jasonstest:jason');

  	// Setting Authentication Header
	$http.defaults.headers.common.Authorization = 'Basic ' + authStr;



    var self = this;
    
    // Grab the projects 
    self.projects = [];
    self.tasks = [];
    $http.get('https://csgprohackathonapi.azurewebsites.net/api/Projects').then(function(response){
    	self.projects = response.data;
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
	self.startTracking = function(project){
		var d = new Date();

		var defaultTask = project.ProjectTasks[0];
		var defaultRole = project.ProjectRoles[0];

		console.log(project);
		console.log(defaultRole);
		console.log(defaultTask);
		console.log(d);

		// FIRST THING TO DO - just get a damn stopwatch to appear from the time when the user clicked the project

		// if someone hits stop, update with a TimeOut
		// otherwise - if they hit start on another project, do nothing.
		// destroy interval instance


	};
	self.openAddProjectTask = function(){

	};
	self.toggleTracking = function (project){

	};
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
  function DoTimeStuff ($interval, dateFilter){
  	return function(scope, element, attrs) {
      var format,  // date format
          stopTime; // so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      // watch the expression, and update the UI on change.
      scope.$watch(attrs.myCurrentTime, function(value) {
        format = value;
        updateTime();
      });

      stopTime = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTime);
      });
    }
  }

})();