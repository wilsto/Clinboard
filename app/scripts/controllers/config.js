'use strict';


/* Controleurs Config */
/********************/
angular.module('clinBoardApp')
.controller('configCtrl', function($rootScope, $scope, $http, $modal, $filter, ngTableParams){

$scope.Math = window.Math;

  /**
   * Retrieve data
   */
  
  $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        getData: function($defer, params) {
             $http.get('/REST/'+ $scope.dataType).success(function (data) {

                //Dynamic columns
                _.each(data, function(rowdata) {  // pour chaque enregistrement
                    _.each(rowdata, function(value, keyName) {  // pour chaque clé d'enregistrement
                        if (keyName!=='_id' && keyName!=='id' && _.find( $scope.columns, function(key){return key.title == keyName; }) === undefined ) { // si pas de doublons
                            $scope.columns.push({ title: keyName, field: keyName, visible: true, filter: { keyName: 'text' } }); // on ajoute les colonnes
                           // $scope.filter_row[keyName] = ''; // on ajoute les noms de colonnes dans le filtre // pas besoin en fait
                        }; 
                    });
                });   

                //Filter and sort data by page
                var filteredData = $scope.filter_row ?            $filter('filter')(data, $scope.filter_row) :                   data;
                var orderedData = params.sorting() ?              $filter('orderBy')(filteredData, params.orderBy()) :           filteredData;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
        }
  });


  $scope.loadData = function(dataType) {
    $scope.dataType =  dataType;
    $scope.columns = [];
    $scope.filter_row = {};
    $scope.tableParams.reload();
  };

  $scope.$watch("filter_row", function () {
      if($scope.filter_row !== undefined && $scope.tableParams){
          $scope.tableParams.reload();
      }
  }, true);


  $scope.saveData = function(rowdata) {
    rowdata.$edit = false;
      $http.put('/REST/'+ $scope.dataType + '/'+rowdata._id, rowdata)
        .success(function(data) {
      });
    
  };



  /**
   * Modal
   */

   $scope.open = function (typeData, data) {
    $rootScope.typeData = typeData;
    $rootScope.data = data;

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency. It is not the same as the $modal service used above.
  var ModalInstanceCtrl = function ($rootScope, $scope, $modalInstance) {
    $scope.formData = $rootScope.data ;

    if ($rootScope.typeData === 'activities') { $scope.typeaheads = $rootScope.activities ;}
    if ($rootScope.typeData === 'axes') {$scope.typeaheads = $rootScope.axes ;}
    if ($rootScope.typeData === 'contextes') { $scope.typeaheads = $rootScope.contextes ;}

    console.log( $rootScope.typeData);
    console.log( $rootScope.activities);
    console.log( $scope.typeaheads);

    $scope.selected = {};
    $scope.activities = $rootScope.activities;

    $scope.setId = function(parent) {
      console.log(parent.id);
      console.log($scope.formData);
      $scope.formData.parentId = parent.id;
    };

    $scope.ok = function () {
      $modalInstance.close();
      $http.post('/REST/'+$rootScope.typeData, $scope.formData)
        .success(function(data) {
      });
      if ($rootScope.typeData === 'activities') {$rootScope.activities.push($scope.formData);}
     if ($rootScope.typeData === 'axes') { $rootScope.axes.push($scope.formData);}
     if ($rootScope.typeData === 'contextes') { $rootScope.contextes.push($scope.formData);}
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

});


