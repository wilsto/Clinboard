'use strict';

var app = angular.module('clinBoardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'dialogs',
  'angular.directives-round-progress',
  'nvd3ChartDirectives',
  'xeditable'
]);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/dash', {
        templateUrl: 'partials/dash',
        controller: 'dashCtrl'
      })
      .when('/ind', {
        templateUrl: 'partials/ind',
        controller: 'indCtrl'
      })
      .when('/mesures', {
        templateUrl: 'partials/mesures',
        controller: 'mesuresCtrl'
      })
      .when('/tasks', {
        templateUrl: 'partials/tasks',
        controller: 'tasksCtrl',
        resolve: {
          activities: function(srvLibrary) {
            return srvLibrary.getActivities();
          },
          contextes: function(srvLibrary) {
            return srvLibrary.getContextes();
          },
          axes: function(srvLibrary) {
            return srvLibrary.getAxes();
          },
          tasks: function(srvLibrary) {
            return srvLibrary.getTasks();
          }
        }
      }) 
      .when('/task/:taskId', {
        templateUrl: 'partials/task',
        controller: 'taskCtrl',
        resolve: {
          activities: function(srvLibrary) {
            return srvLibrary.getActivities();
          },
          contextes: function(srvLibrary) {
            return srvLibrary.getContextes();
          },
          axes: function(srvLibrary) {
            return srvLibrary.getAxes();
          }
        }
      })  
      .when('/calendar', {
        templateUrl: 'partials/calendar',
        controller: 'calendarCtrl',
        resolve: {
          activities: function(srvLibrary) {
            return srvLibrary.getActivities();
          },
          contextes: function(srvLibrary) {
            return srvLibrary.getContextes();
          },
          axes: function(srvLibrary) {
            return srvLibrary.getAxes();
          }
        }
      })           
      .when('/config', {
        templateUrl: 'partials/config',
        controller: 'configCtrl'
      })
      .when('/decid', {
        templateUrl: 'partials/decid',
        controller: 'decidCtrl'
      })
;
      
    $locationProvider.html5Mode(true);
  });

app.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});



/* ***************
     Constants 
   ***************/


app.constant('progressStatus',
[                                                                                                                                                                                                             
  {name: 'On time'},                                                                                                                                                                                                                         
  {name: 'At Risk'},                                                                                                                                                                                                                         
  {name: 'Late'}
]);

app.constant('taskStatus',
[                                                                                                                                                                                                             
  {name: 'Not Started'},                                                                                                                                                                                                                         
  {name: 'In Progress'},                                                                                                                                                                                                                         
  {name: 'Withdrawn'},
  {name: 'Finished with errors'},
  {name: 'Finished'}
]);


app.constant('categoryInd',
[                                                                                                                                                                                                             
  {name: 'Objectif'},                                                                                                                                                                                                                         
  {name: 'Alerte'},                                                                                                                                                                                                                         
  {name: 'Anticpation'},
  {name: 'Information'}
]);

angular.module('clinBoardApp')
   .controller('rightMenuCtrl', function ($rootScope, $scope, $http, $q) {


app.run(['$rootScope', function($root) {
  $root.$on('$routeChangeStart', function(e, curr, prev) { 
    if (curr.$$route && curr.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $root.loadingView = true;
    }
  });
  $root.$on('$routeChangeSuccess', function(e, curr, prev) { 
    // Hide loading message
    $root.loadingView = false;
  });
}]);

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
      })]);

  promise.then(function () {
      $rootScope.perimeter = {refContexte:'',refActivity:'',refAxe:'',category:[true, true, true, true],time:''};
      $scope.updateRef();
  });

  $scope.updateRef = function(){
      // decoder le contexte et les activités pour les mesures
      var even = _.where($rootScope.contextes, {id: $rootScope.perimeter.refcontexte});
      if (even.length > 0 ) {$rootScope.perimeter.Contexte = even[0].name};
      var even = _.where($rootScope.activities, {id: $rootScope.perimeter.refActivity});
      $rootScope.perimeter.Activity = even[0].name;
  }

  $scope.setContextId = function(parent) {
    $scope.perimeter.refContexte = parent.id;
  };

  $scope.setActivityId = function(parent) {
    $scope.perimeter.refActivity = parent.id;
  };

  $scope.setAxeId = function(parent) {
    $scope.perimeter.refAxe = parent.id;
  };

  $scope.updatePerimeter = function(blnSave) {
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

});