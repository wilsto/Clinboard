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
		getDashBoards: function(id) {
			if (typeof id == 'undefined') {
				var promise = $http.get('/REST/dashboards').success(function (data) { 
					return data;
				})
			} else {
				var promise = $http.get('/REST/dashboards/'+id).success(function (data) { 
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
		getTasks: function(id) {
			if (typeof id == 'undefined') {
				var promise = $http.get('/REST/taches').success(function (data) { 
					return data;
				})
			} else {
				var promise = $http.get('/REST/taches/'+id).success(function (data) { 
					return data;
				});
			}
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


angular.module('clinBoardApp').factory('calLibrary', ['$http', '$rootScope', '$q', '$routeParams','$timeout',function($http,$rootScope,$q, $routeParams,$timeout) {
	var sdo = {
		getSumByMonth: function(data, field) {
				console.log('data',data);

				var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
				  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

				var map_result = _.map(data, function (item) {
				  var d = new Date(new Number(new Date(item[field])));
				  var month = d.getFullYear()  + ", " +  monthNames[d.getMonth()];
				  return {
				      "Month": month,
				      "User_Count": 1
				  };
				});

				var result_temp = _.reduce(map_result, function (memo, item) {
				  if (memo[item.Month] === undefined) {
				      memo[item.Month] = item.User_Count;
				  }else{
				      memo[item.Month] += item.User_Count;
				  }
				  return memo;
				},{});

				//then wrap the result to the format you expected.
				var result = _.map(result_temp, function(value, key){
				  return {
				      "Month": key,
				      "User_Count": value
				  };
				});
				console.log('result',result);
				return result;
		},
		getSumCumul : function(ref, value){

			var result={ref:[],val:[]};

			/*cumulative à faire */
			var lastval = 0;
			$.each(ref, function( indexref, valueref ) {
				result.ref.push([indexref,indexref+1]);
				var blnFind = false;
			  	$.each(value, function( index, value ) {
			  		if (valueref.date == value.date) {
			  			blnFind = true;
			  			lastval = index+1;
			  		} 
				});
			  	result.val.push([indexref,lastval]);
			});

/*			var result = myarray.concat();
			for (var i = 0; i < myarray.length; i++){
			    result[i] = myarray.slice(0, i + 1).reduce(function(p, i){ return p + i; });
			}*/
			console.log('resultCumul',result);
			return result;
		}
	}
	return sdo;
}]);