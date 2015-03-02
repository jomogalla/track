(function(){
	'use strict';  	

  	angular
		.module('app')
		.controller('ModalAddProjectCtrl', ModalAddProjectCtrl);

	ModalAddProjectCtrl.$inject = ['$modalInstance', 'httpService'];
  	function ModalAddProjectCtrl ($modalInstance, httpService){
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
