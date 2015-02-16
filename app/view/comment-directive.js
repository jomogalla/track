(function(){
	'use strict';

	angular
		.module('myComment',[])
		.directive('autoexpand', AutoExpand);

	AutoExpand.$inject = ['$timeout', '$compile'];
	function AutoExpand($timeout, $compile){
		var directive = {
			link:link,
			
		};
		return directive;

		
		function link(scope, element, attrs){
			var shadowTextArea,
			textArea;

			activate();
			scope.autoExpand = autoExpand;

    		function autoExpand(){
    			shadowTextArea.value = textArea.value;
    			shadowTextArea.value += "\n";
    			if(shadowTextArea.scrollHeight > 40){
	    			textArea.style.height = (shadowTextArea.scrollHeight)+ 'px';
	    		}
	    		else{
	    			textArea.style.height = "40px";
	    		}
    		}


    		function activate(){
	    		// make it easier to grab our text area
				textArea = element[0];

				scope.textAreaModel = attrs.ngModel;


				// will attaching this class create an infinite loop haha
				scope.textAreaClass = attrs.class;

				// make our shadow text area
				element.after($compile('<textarea ng-bind="' + scope.textAreaModel + '" class="' + scope.textAreaClass + '"></textarea>')(scope));

				shadowTextArea = element.next();

				// setting up the shadows styles/attributes
				shadowTextArea = shadowTextArea[0];
				shadowTextArea.style.height = "0px !important";
				shadowTextArea.style.minHeight = "0px !important";
				shadowTextArea.style.position = "absolute";
				shadowTextArea.style.zIndex = "-10000";
				shadowTextArea.style.border = "0";
				shadowTextArea.style.visibility = "hidden";
				shadowTextArea.style.top = "0px";
				shadowTextArea.style.left = "0px";
				shadowTextArea.tabIndex = "-1";

				element.bind("keyup", function(){
					scope.autoExpand();
				});

				$timeout(autoExpand, 0);
    		}
  
  			
		}
	}
})();