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


app.constant('categoryInd',
[                                                                                                                                                                                                             
  {name: 'Objectif'},                                                                                                                                                                                                                         
  {name: 'Alerte'},                                                                                                                                                                                                                         
  {name: 'Anticpation'},
  {name: 'Information'}
]);

angular.module('clinBoardApp')
   .controller('rightMenuCtrl', function ($rootScope, $scope, $http, $q) {


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
      $rootScope.perimeter = {refContexte:'',refActivity:'MzLk4bjhKbDIp8Ka',refAxe:'',category:[],time:''};
      // decoder le contexte et les activités pour les mesures
        var even = _.where($rootScope.contextes, {id: $rootScope.perimeter.refcontexte});
        if (even.length > 0 ) {$rootScope.perimeter.Contexte = even[0].name};
        var even = _.where($rootScope.activities, {id: $rootScope.perimeter.refActivity});
        $rootScope.perimeter.Activity = even[0].name;
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

  $scope.updatePerimeter = function() {
      $rootScope.$broadcast('perimeterChanged','');

  if ($scope.perimeter._id) {
    $http.put('/REST/dashboard/'+$scope.perimeter._id, $scope.perimeter)
    .success(function(data) {
    });
  }else{
    $http.post('/REST/dashboard', $scope.perimeter)
    .success(function(data) {
    });
  }

  };


   });