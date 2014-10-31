'use strict';

angular.module('clinBoardApp')
  .controller('indCtrl', function ($rootScope, $scope, $modal, $http, $filter, ngTableParams, $q, categoryInd) {
    $scope.Math = window.Math;

$scope.categoryInd = categoryInd;
$scope.types = [
    {value: 'charge', text: 'Charge'},
    {value: 'délai', text: 'Délai'},
    {value: 'avancement', text: 'Avancement'},
    {value: 'confiance', text: 'Confiance'},
    {value: 'startDate', text: 'Début'},
    {value: 'endDate', text: 'Fin'},
    {value: 'progress', text: 'Progress'},
    {value: 'status', text: 'Statut'},
    {value: 'constante', text: 'Constante'}
  ]; 

$scope.actions = [
    {value: 'Liste', text: 'Liste'},
    {value: 'Compte', text: 'Compte'},
    {value: 'Moyenne', text: 'Moyenne'},
    {value: 'Somme', text: 'Somme'},
    {value: 'Min', text: 'Min'},
    {value: 'Max', text: 'Max'}
  ]; 

$scope.groupByTime = [
    {value: 'Aucun', text: 'Aucun'},
    {value: 'Jour', text: 'Jour'},
    {value: 'Semaine', text: 'Semaine'},
    {value: 'Mois', text: 'Mois'},
    {value: 'Année', text: 'Année'}
  ]; 

    $scope.columns = [];
    $scope.filter_row = {};
    $scope.tabactive ='info';
    
  /**
   * Retrieve data
   */
  
  var deferred = $q.defer();

  $http.get('/REST/activities').success(function (data) {
    $rootScope.activities = data;
  });

  $http.get('/REST/axes').success(function (data) {
    $rootScope.axes = data;
  });

  $http.get('/REST/contextes').success(function (data) {
    $rootScope.contextes = data;
  });

  $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        getData: function($defer, params) {
             $http.get('/REST/indicateurs').success(function (data) {

                _.each(data, function(rowdata, index) {  // pour chaque enregistrement

                  // decoder le contexte et les activités pour les indicateurs
                    var even = _.where($rootScope.contextes, {id: rowdata.refContexte});
                    rowdata.Contexte = even[0].name;
                    even = _.where($rootScope.activities, {id: rowdata.refActivity});
                    rowdata.Activity = even[0].name;
                    even = _.where($rootScope.axes, {id: rowdata.refAxe});
                    rowdata.Axe = even[0].name;

                    even = _.filter($rootScope.contextes, function(contexte){ return contexte.name.indexOf(rowdata.Contexte)>=0;});

                    // mesures
                   $http.get('/REST/mesures/bytask/'+rowdata.refContexte+'/'+rowdata.refActivity).success(function (mesures) {

                        data[index]._type = 1;

                        data[index]._mesures = mesures;
                        data[index].mesuresNb = mesures.length;

                        // decoder le contexte et les activités pour les mesures
                        _.each(_.keys(data[index]._mesures ), function(keyM) {
                          var even = _.where($rootScope.contextes, {id: data[index]._mesures[keyM].refcontexte});
                          data[index]._mesures[keyM].Contexte = even[0].name;
                          var even = _.where($rootScope.activities, {id: data[index]._mesures[keyM].refActivity});
                          data[index]._mesures[keyM].Activity = even[0].name;
                        });

                        data[index].mesureName = data[index].type;

                        //Valeurs
                        if (typeof data[index].typedetails !== "undefined") {
                          var checksType = data[index].typedetails.split(' + ');
                        }
                        if (typeof data[index].reftypedetails !== "undefined") {
                          var checksRefType = data[index].reftypedetails.split(' + ');
                        }
                        
                        switch(data[index].action) {
                          case 'Compte':
                              // valeurs principales
                             var even = _.filter(mesures, function(mesure){ 
                                if (typeof checksType !== "undefined") {
                                   var blnFind = false;
                                    _.each(checksType, function(check) {
                                         if (mesure[data[index].type] == check) { blnFind = true } ; // avec indexOf pour le like
                                    });
                                    return blnFind; 
                                } else {
                                    return true;
                                }
                              });
                              data[index].mesureVal = even.length;

                              // valeurs références
                              var evenRef = _.filter(mesures, function(mesure){ 
                                if (typeof checksRefType !== "undefined") {                                
                                   var blnFind = false;
                                    _.each(checksRefType, function(check) {
                                         if (mesure[data[index].reftype] == check) { blnFind = true } ; // avec indexOf pour le like
                                    });
                                    return blnFind;
                                } else {
                                    return true;
                                }
                              });
                              data[index].reference = evenRef.length;
                              break;
                          default :
                            data[index].mesureVal = mesures[mesures.length - 1][data[index].type];
                            if (mesures.length > 1) data[index]._mesurePrevVal = mesures[mesures.length - 2][data[index].type];
                            data[index].reference = 100;                              
                        }


                        //calcul de l'age de la dernière mesure
                        var date1 = new Date(mesures[mesures.length - 1].date);
                        var date2 = new Date();
                        var diff = dateDiff(date1, date2);
                        data[index].ageVal = diff.day ;

                        data[index].percentObjectif = (data[index].mesureVal /  data[index].reference) * 100 +'%';

                       deferred.resolve(data);
                      });
                });

                var promise = deferred.promise;
                promise.then(function(data) {
                    //Dynamic columns
                    _.each(data, function(rowdata) {  // pour chaque enregistrement
                        _.each(rowdata, function(value, keyName) {  // pour chaque clé d'enregistrement
                            if (keyName.charAt(0)!=='_' && keyName!=='id' && _.find( $scope.columns, function(key){return key.title === keyName; }) === undefined ) { // si pas de doublons
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
              });
        }
  });

function dateDiff(date1, date2){
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
}

$scope.openDetail = function(rowdata, index) {
    $scope.indDetail= rowdata;
    $scope.indMesures =    $scope.indDetail._mesures;
    ($scope.currentDetails == index) ? $scope.currentDetails = -1: $scope.currentDetails = index;
    
  };

 $scope.isShowingDetail = function(index){
        return  $scope.currentDetails === index;
    };

  $scope.openIndicateur = function (Indicateur) {
    $rootScope.Indicateur = Indicateur;
    var modalInstance = $modal.open({
      templateUrl: '../../views/modals/myIndicateurContent.html',
      controller: IndicateurInstanceCtrl
    });
  };





$scope.updateInd = function(name, data) {
    $scope.myData = {};
    $scope.myData[name] = data;
    return $http.post('/REST/indicateurs/' + $scope.indDetail._id, $scope.myData);
};



// Please note that $modalInstance represents a modal window (instance) dependency. It is not the same as the $modal service used above.
var IndicateurInstanceCtrl = function ($rootScope, $scope, $modalInstance) {
  $scope.formData = $scope.Indicateur;
  $scope.activities = $rootScope.activities;
  $scope.contextes = $rootScope.contextes;
  $scope.axes = $rootScope.axes;

  $scope.setContextId = function(parent) {
    $scope.formData.refContexte = parent.id;
  };

  $scope.setActivityId = function(parent) {
    $scope.formData.refActivity = parent.id;
  };

  $scope.setAxeId = function(parent) {
    $scope.formData.refAxe = parent.id;
  };

  $scope.today = function() {
    $scope.date = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.date = null;
  };

// Disable weekend selection
$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = ( $scope.minDate ) ? null : new Date();
};
$scope.toggleMin();

$scope.open1 = function($event) {
  $event.preventDefault();
  $event.stopPropagation();

  $scope.opened1 = true;
};

$scope.open2 = function($event) {
  $event.preventDefault();
  $event.stopPropagation();

  $scope.opened2 = true;
};

$scope.open3 = function($event) {
  $event.preventDefault();
  $event.stopPropagation();

  $scope.opened3 = true;
};

$scope.dateOptions = {
  'year-format': '\'yyyy\'',
  'starting-day': 1
};

$scope.format = 'dd-MMMM-yyyy';



$scope.setContextId = function(parent) {
  $scope.formData.refContexte = parent.id;
};

$scope.setActivityId = function(parent) {
  $scope.formData.refActivity = parent.id;
};

$scope.ok = function () {
  $modalInstance.close();

  if ($scope.formData._id) {
    $http.put('/REST/Indicateurs/'+$scope.formData._id, $scope.formData)
    .success(function(data) {
    });
  }else{
    $http.post('/REST/Indicateurs', $scope.formData)
    .success(function(data) {
    });
  }

};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};
};


/*  $scope.$watch("filter_row", function () {
      if($scope.filter_row !== undefined && $scope.tableParams){
          $scope.tableParams.reload();
      }
  }, true);*/

  });
