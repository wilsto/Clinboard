'use strict';

angular.module('clinBoardApp')
.controller('headerCtrl', function($rootScope, $scope){
// une fois le rendu terminé
	$scope.$on('tasksok', function(ngRepeatFinishedEvent) {
		$scope.tasks = $rootScope.tasks;
	});
});

angular.module('clinBoardApp')
.controller('MainCtrl', function($rootScope, $scope, $http, $location,$compile, dashboards, tasks){

	$scope.dashboards = dashboards.data;
	$scope.tasks = tasks.data;
	$rootScope.tasks = tasks.data;
	$scope.$emit('tasksok');

	//Initialize & config popover controls
	$('#dashboard-report-supervision').popover({ html : true })
	    .click(function(ev) {
	     //this is workaround needed in order to make ng-click work inside of popover
	     $scope.$apply(function () {
	       	$scope.perimeter = $rootScope.perimeter;
	     	$compile($('.popover.in').contents())($scope);
         });
	});

	$scope.setContextId = function(parent) {
	    $scope.perimeter.refContexte = parent.id;
	};

	$scope.setActivityId = function(parent) {
	    $scope.perimeter.refActivity = parent.id;
	};

	$scope.setAxeId = function(parent) {
	    $scope.perimeter.refAxe = parent.id;
	};

	$scope.closePerimeter = function() {
		$('#dashboard-report-supervision').popover('hide');
	}
	$scope.updatePerimeter = function(blnSave) {
	            console.log('$rootScope.perimeter',$rootScope.perimeter );
       console.log('$scope.perimeter',$scope.perimeter );
	    $rootScope.$broadcast('perimeterChanged','');

	    // sauvegarder si demandé
	    if (blnSave) {
	        if ($scope.perimeter._id) {
	          $http.put('/REST/dashboards/'+$scope.perimeter._id, $scope.perimeter)
	          .success(function(data) {
	          });
	        }else{
	          $http.post('/REST/dashboards', $scope.perimeter)
	          .success(function(data) {
	          });
	        }
	    }
	    else {
	      $scope.perimeter._id = null;
	      $scope.perimeter.name = 'Custom (not saved)';
	    }

	};

	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	    //you also get the actual event object
	    //do stuff, execute functions -- whatever...
	    Index.initKnowElements();
	});

});

