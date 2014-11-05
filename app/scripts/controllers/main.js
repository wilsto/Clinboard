'use strict';

angular.module('clinBoardApp')
.controller('MainCtrl', function($rootScope, $scope, $http, $location){


$scope.LoadDashboards = function(){
	$http.get('/REST/dashboards').success(function (data) {
		$scope.dashboards = data;
	});
};

$scope.LoadDashboards();


$scope.openDashboard = function(dashboard){
	event.preventDefault();
	
	$rootScope.perimeter = dashboard;


	$location.path( "/dash" );
};

});

