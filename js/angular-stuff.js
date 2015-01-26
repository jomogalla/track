(function () {
  'use strict';
  
  angular.module('app', []);
  
  angular.module('app')
    .controller('TimeTrack', TimeTrack);
  
  
  function TimeTrack () {
    var self = this;
    
    self.projects = [];
    
    self.tasks = [];
    
    self.addProject = function() {
    	// do a modal here
      	var newProject = {id:(self.projects.length+1), name:"Project " + (self.projects.length+1)};
      	self.projects.push(newProject);
    };
    // Role should be basically the same
    self.addTask = function() {
    	// do a modal here
   		var newTask = {id:(self.tasks.length+1), name:"Task " + (self.tasks.length+1), projectId:};
      	self.tasks.push(newTask);
    };
    self.getRandomSpan = function(){
 		return Math.floor((Math.random()*6)+1);
	}
  }
})();