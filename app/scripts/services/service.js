'use strict';

angular.module('clinBoardApp').service('profile', function() {
	this.name = "Anonymous";
	this.id = null;
	this.login = function(){
        // faire un truc pour se loger
    }
    this.logout = function(){
        // faire un truc pour se deco
    }
});

angular.module('clinBoardApp').factory('srvLibrary', ['$http', '$rootScope',function($http,$rootScope) {
	var sdo = {
		getActivities: function() {
			var promise = $http.get('/REST/activities').success(function (data) {
				$rootScope.activities = data;
				return data;
			});
			return promise;
		},
		getContextes: function() {
			var promise = $http.get('/REST/contextes').success(function (data) { 
				$rootScope.contextes = data;
				return data;
			});
			return promise;
		},
		getAxes: function() {
			var promise = $http.get('/REST/axes').success(function (data) { 
				$rootScope.axes = data;
				return data;
			});
			return promise;
		},
		getTasks: function() {
			var promise = $http({ method: 'GET', url: '/REST/taches' }).success(function(data, status, headers, config) {
				return data;
			});
			return promise;
		},		
		getMovies: function() {
			var promise = $http({ method: 'GET', url: 'api/movies.php' }).success(function(data, status, headers, config) {
				return data;
			});
			return promise;
		}
	}
	return sdo;
}]);

angular.module('clinBoardApp').directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
});