(function(){
	'use strict';

	angular
		.module('app')
		.controller('ModalAddTaskCtrl', ModalAddTaskCtrl);

	ModalAddTaskCtrl.$inject = ['$modalInstance','httpService', 'project'];
	function ModalAddTaskCtrl ($modalInstance, httpService, project){
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
})();