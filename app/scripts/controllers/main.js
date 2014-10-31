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
	
	$rootScope.perimeter._id = dashboard._id;
	$rootScope.perimeter.name = dashboard.name;

	$rootScope.perimeter.refActivity = dashboard.refActivity;
	$rootScope.perimeter.Activity = dashboard.Activity;

	$rootScope.perimeter.refContexte = dashboard.refContexte;
	$rootScope.perimeter.Contexte = dashboard.Contexte;

	$rootScope.perimeter.refAxe = dashboard.refAxe;
	$rootScope.perimeter.Axe = dashboard.Axe;



	$location.path( "/dash" );
};

});

