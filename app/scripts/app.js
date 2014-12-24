'use strict';

var app = angular.module('clinBoardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'dialogs',
  'ngTable',
  'angular.directives-round-progress',
  'nvd3ChartDirectives',
  'xeditable',
  'mgcrea.ngStrap.popover'
]);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        resolve: {
          initData: function(srvLibrary) {
            return srvLibrary.getInitData();
          },
          dashboards: function(srvLibrary) {
            return srvLibrary.getDashBoards();
          },
          tasks: function(srvLibrary) {
            return srvLibrary.getTasks();
          },
          indicateurs: function(srvLibrary) {
            return srvLibrary.getIndicateurs();
          }
        }
      }) 
      .when('/dash/:dashId', {
        templateUrl: 'partials/dash',
        controller: 'dashCtrl',
        resolve: {
          initData: function(srvLibrary) {
            return srvLibrary.getInitData();
          },
          dashboards: function(srvLibrary, $route) {
            return srvLibrary.getDashBoards($route.current.params.dashId);
          },
          indicateurs: function(srvLibrary) {
            return srvLibrary.getIndicateurs();
          }
        }
      })
      .when('/indicator/:id', {
        templateUrl: 'partials/indicator',
        controller: 'indicatorCtrl',
        resolve: {
          indicators: function(srvLibrary, $route) {
            return srvLibrary.getIndicateurs($route.current.params.id);
          },
        }
      })
      .when('/mesures', {
        templateUrl: 'partials/mesures',
        controller: 'mesuresCtrl',
        resolve: {
          initData: function(srvLibrary) {
            return srvLibrary.getInitData();
          }
        }
      })
      .when('/tasks', {
        templateUrl: 'partials/tasks',
        controller: 'tasksCtrl',
        resolve: {
          tasks: function(srvLibrary) {
            return srvLibrary.getTasks();
          }
        }
      }) 
      .when('/task/:taskId', {
        templateUrl: 'partials/task',
        controller: 'taskCtrl',
        resolve: {
          tasks: function(srvLibrary, $route) {
            return srvLibrary.getTasks($route.current.params.taskId);
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
  {name: 'Anticipation'},
  {name: 'Information'}
]);

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