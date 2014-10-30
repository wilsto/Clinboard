'use strict';

var app = angular.module('clinBoardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'dialogs',
  'ngGrid',
  'angular.directives-round-progress',
  'nvd3ChartDirectives',
  'ngTable',
  'gridster',
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
      .when('/config', {
        templateUrl: 'partials/config',
        controller: 'configCtrl'
      })
      .when('/decid', {
        templateUrl: 'partials/decid',
        controller: 'decidCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
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

