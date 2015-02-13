(function(){
	'use strict';

	angular
		.module('app')
		.controller('ManageCtrl', ManageCtrl);

	ManageCtrl.$inject = ['$modal','httpService', 'projects'];
	function ManageCtrl($modal, httpService, projects){
		var self = this;

		self.projects = projects;

		self.addProject = addProject;
		self.addTask = addTask;
		self.toggleBillable = toggleBillable;
		self.toggleArchive = toggleArchive;
		self.toggleCommentRequirement = toggleCommentRequirement;
		self.deleteTask = deleteTask;
		self.renameTask = renameTask;

		activate();


	    // Project Related Functions
		function addProject (){

	    	var modalInstance = $modal.open({
		    	templateUrl: 'modals/modal-add-project.html',
		    	controller: 'ModalAddProjectCtrl',
		    	controllerAs: 'modalVM',

		    });

		    modalInstance.result.then(function (newProject) {
				self.projects.push(newProject);
			});
		}

		function toggleArchive (project){
			project.Archived = !project.Archived;

			var updatedProject = {
					"Name": project.Name,
					"Archived": project.Archived
			};

			httpService.updateItem('Projects', project.ProjectId, updatedProject).then(function(data) {
				console.log('Project Updated');
			});
		}
	    
	    function addTask (project){

		    var modalInstance = $modal.open({
		    	templateUrl: 'modals/modal-add-task.html',
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
	    }

	    // Task Related Functions
		function toggleBillable (task, project){
			task.Billable = !task.Billable;

			var cleanedTaskBillable = {
				"ProjectId": project.ProjectId,
				"Name": task.Name,
				"Billable": task.Billable,
				"RequireComment": task.RequireComment,
				
			};


			httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTaskBillable).then(function(data) {
				console.log('Task billing status updated');
			});
		}
		function toggleCommentRequirement (task, project){
			task.RequireComment = !task.RequireComment;

			var cleanedTaskComment = {
				"ProjectId": project.ProjectId,
				"Name": task.Name,
				"RequireComment": task.RequireComment,
				"Billable": task.Billable,
			};

			httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTaskComment).then(function(data) {
				console.log('Task Comment Requirement Updated');
			});
		}
		function deleteTask (task, project, idx){
			httpService.deleteItem('ProjectTasks', task.ProjectTaskId).then(function(data) {
				project.ProjectTasks.splice(idx, 1);
			});
		}
		function renameTask (task, project, keypress){
			if(keypress.keyCode == 13){
				task.isRenaming = false;

				var cleanedTask = {
					'Name': task.Name,
					'ProjectId': project.ProjectId,
				};

				httpService.updateItem('ProjectTasks', task.ProjectTaskId, cleanedTask).then(function(data) {
					console.log('Task name updated');
				});
			}
		}
		function activate (){
		    // Grab all the projects -- 
		 //    httpService.getCollection('projects').then(function(projects) {
			// 	self.projects = projects;
			// });
		}
	}
	ManageCtrl.resolve = {
		projects: function ($q, httpService){
			var deferred = q.defer();

			httpService.getCollection('projects').then(function(projects) {
				deferred.resolve(projects);
			});
			return deferred.promise;
		}
	};
})();