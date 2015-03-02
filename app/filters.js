(function(){
	'use strict';

	angular
		.module('timeFilters', [ 'angularMoment'])
		.filter('milToTimeString', function() {
  			return function(milliseconds) {
  				if(milliseconds === undefined){
  					return "";
  				}
    			var seconds = Math.floor(milliseconds / 1000) % 60;
    			var hours = Math.floor((milliseconds/1000) / 3600) % 24;
    			var minutes = (Math.floor((milliseconds/1000) / 60) % 60);
    			var days = Math.floor((milliseconds/1000)/ 86400);

                var timeString;
    			if(seconds < 10 && minutes > 0){
					timeString = "0" + seconds;
    			}
    			else{
    				timeString = seconds;
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
		})
        .filter('adjustedDuration', function() {
            return function(duration){
                var roundToFiften = 20,
                    roundToThirty = 35,
                    roundToFourtyFive = 50;

                var minutes = moment.duration(duration).minutes();
                var hours = moment.duration(duration).hours();
                var days = moment.duration(duration).days();
                if(days > 0){
                    hours = hours + (days*24);
                }
               
                

                // trimming leading zeroes
                hours = parseInt(hours, 10);
                minutes = parseInt(minutes, 10);


                if(minutes !== 0 && minutes < roundToFiften){
                    minutes = 15;
                }else if(minutes >= roundToFiften && minutes < roundToThirty){
                    minutes = 30;
                }else if(minutes >= roundToThirty && minutes < roundToFourtyFive){
                    minutes = 45;
                }else if(minutes >= roundToFourtyFive){
                    minutes = 0;
                    hours = hours + 1;
                }

                

                // debugger;
                if(hours === 0){
                    return minutes + "m";
                }else if(minutes === 0 && hours !== 0){
                    return hours + "h";
                }
                else{
                    return hours + "h " + minutes + "m";
                }
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