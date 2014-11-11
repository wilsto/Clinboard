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

angular.module('clinBoardApp').factory('srvLibrary', ['$http', '$rootScope', '$q', '$routeParams','$timeout',function($http,$rootScope,$q, $routeParams,$timeout) {
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
		getDashBoards: function(dashId) {
			if (typeof dashId == 'undefined') {
				var promise = $http.get('/REST/dashboards').success(function (data) { 
					return data;
				})
			} else {
				var promise = $http.get('/REST/dashboards/'+dashId).success(function (data) { 
					return data;
				});
			}

			return promise;
		},
		getIndicateurs: function(id) {
			if (typeof id == 'undefined') {
				var promise = $http.get('/REST/indicateurs').success(function (data) { 
					return data;
				})
			} else {
				var promise = $http.get('/REST/indicateurs/'+id).success(function (data) { 
					return data;
				});
			}
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
		},
		getInitData : function() {
			var deferred = $q.defer();
			var promise = $q.all([
				$http.get('/REST/activities').success(function (data) {
				    $rootScope.activities = data;
				  }), 
				$http.get('/REST/axes').success(function (data) {
				    $rootScope.axes = data;
				  }),
				$http.get('/REST/contextes').success(function (data) {
				    $rootScope.contextes = data;
				  })
			]);

			promise.then(function () {
			  	if (typeof  $rootScope.perimeter == "undefined" ) {$rootScope.perimeter = {refContexte:'',refActivity:'',refAxe:'',category:[true, true, true, true],time:''}};
				// decoder le contexte et les activités pour les mesures
				var even = _.where($rootScope.contextes, {id: $rootScope.perimeter.refcontexte});
				if (even.length > 0 ) {$rootScope.perimeter.Contexte = even[0].name};
				var even = _.where($rootScope.activities, {id: $rootScope.perimeter.refActivity});
				if (even.length > 0 ) {$rootScope.perimeter.Activity = even[0].name};
			});

		}
	}
	return sdo;
}]);

angular.module('clinBoardApp').directive('onFinishRender', function ($timeout) {
	console.log('yyy');
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