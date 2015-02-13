(function(){
	'use strict';

	angular
		.module('timeFilters', [])
		.filter('milToTimeString', function() {
  			return function(milliseconds) {
  				if(milliseconds === undefined){
  					return "";
  				}
    			var seconds = Math.floor(milliseconds / 1000) % 60;
    			var hours = Math.floor((milliseconds/1000) / 3600) % 24;
    			var minutes = (Math.floor((milliseconds/1000) / 60) % 60);
    			var days = Math.floor((milliseconds/1000)/ 86400);


    			if(seconds < 10 && minutes > 0){
					var timeString = "0" + seconds;
    			}
    			else{
    				var timeString = seconds;
    			}
    			if(minutes < 10 && hours > 0){
    				timeString = "0" + minutes + ":" + timeString;
    			} 
    			else if(minutes > 0){
    				timeString = minutes + ":" + timeString;
    			}
    			if(hours > 0){
    				timeString = hours + ":" + timeString;
    			} 
    			if(days > 0){
    				timeString = days + " - " + timeString;
				}

    			return timeString;
  			};
		});
    // describe('time filter', function(){
    //     var $filter;

    //     beforeEach(inject(function(_$filter_){
    //         // The injector unwraps the underscores (_) from around the parameter names when matching
    //         $filter = _$filter_;
    //     }));

    //     it('should return nothing if the value is undefined', function(){
    //         var timeFilter = $filter('milToTimeString');

    //         assert.equal(timeFilter(), '""');
    //     });
    // });
})();