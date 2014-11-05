'use strict';

angular.module('clinBoardApp')
  .controller('mesuresCtrl', function($rootScope, $scope, $http, $modal, $dialogs,taskStatus, progressStatus){

  $scope.debug = false;

  $rootScope.taskStatus = taskStatus;
  $rootScope.progressStatus = progressStatus;

  $scope.options = {
    widget_margins: [10, 10],
    widget_base_dimensions: [140, 140],
    helper: 'clone',
    resize: {
      enabled: true,
      axes: ['x', 'y', 'both'],
      max_size: [2, 2]
    }
  };
  $scope.roundProgressData = {
    label: 75,
    percentage: 0.75
  };

  $scope.LoadWidgets = function(){
    $http.get('/REST/taches').success(function (data) {
        $scope.taches = data;

/*      //generate random number
      for (var i = 0, l = $scope.taches.length; i < l; i++) {
        $scope.taches[i].avancement = Math.floor((Math.random() * 100) + 1);
      }*/

      // decoder le contexte et les activités pour les taches
      //Join json
      _.each(_.keys($scope.taches), function(key) {
        var even = _.where($rootScope.contextes, {id: $scope.taches[key].refContexte});
        $scope.taches[key].Contexte = even[0];
        var even = _.where($rootScope.activities, {id: $scope.taches[key].refActivity});
        $scope.taches[key].Activity = even[0];

        // Aller chercher les mesures par contexte et les activités 
        $http.get('/REST/mesures/bytask/'+$scope.taches[key].refContexte+'/'+$scope.taches[key].refActivity).success(function (mesures) {
          $scope.taches[key].Mesures = mesures;

          // decoder le contexte et les activités pour les mesures
          _.each(_.keys($scope.taches[key].Mesures ), function(keyM) {
            var even = _.where($rootScope.contextes, {id: $scope.taches[key].Mesures[keyM].refcontexte});
            $scope.taches[key].Mesures[keyM].Contexte = even[0].name;
            var even = _.where($rootScope.activities, {id: $scope.taches[key].Mesures[keyM].refActivity});
            $scope.taches[key].Mesures[keyM].Activity = even[0].name;
          });
        });
      });     
    });
 }

 $scope.LoadWidgets();

  $scope.opened = function (tache, index) {
   $scope.DisplayDetails(tache);
   ($scope.currentDetails == index) ? $scope.currentDetails = -1: $scope.currentDetails = index;
  };


 $scope.isShowingDetail = function(index){
        return  $scope.currentDetails == index;
    };

$scope.$watch('taches', function(taches){
    angular.forEach(taches, function(tache, idx){
      if (tache.open) {
        console.log("Opened tache with idx: "+idx);
      }
    })   
  }, true);


  /**
   * Modal
   */

   $scope.delete = function (tache) {
    dlg = $dialogs.confirm('Merci de confirmer','Cette action a pour effet de supprimer la tache du panneau. Les mesures ne sont pas supprimées, ce qui fait que vous (ou une autre personne) pouvez ajouter de nouveau une tache avec ce meme couple Activité/Contexte pour revenir à l\'état initial. <br/><br/>Voulez vous continuer ?');
    dlg.result.then(function(btn){
      $http.delete('/REST/taches/'+tache._id).success(function (data) {
      });
    },function(btn){
        // si non;
      });
  };

  $scope.open = function (opendata) {
    $rootScope.opendata = opendata;
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency. It is not the same as the $modal service used above.
  var ModalInstanceCtrl = function ($rootScope, $scope, $modalInstance) {
    $scope.formData = {};
    $scope.activities = $rootScope.activities;
    $scope.contextes = $rootScope.contextes;
    $scope.taskStatus =  $rootScope.taskStatus;
    $scope.progressStatus =  $rootScope.progressStatus;

    $scope.setContextId = function(parent) {
      $scope.formData.refContexte = parent.id;
    };

    $scope.setActivityId = function(parent) {
      $scope.formData.refActivity = parent.id;
    };

    $scope.retrieveData = function () {
      $scope.formData = {};
    };


    $scope.ok = function () {
      $modalInstance.close();
      $http.post('/REST/'+$rootScope.opendata, $scope.formData)
      .success(function(data) {
      });
      if ($rootScope.opendata == 'activities') $rootScope.activities.push($scope.formData);
      if ($rootScope.opendata == 'axes')  $rootScope.axes.push($scope.formData);
      if ($rootScope.opendata == 'contextes')  $rootScope.contextes.push($scope.formData);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };


  $scope.openMesure = function (mesure, newItem) {
    $rootScope.mesure = mesure;
    $rootScope.newItem = newItem;

    var modalInstance = $modal.open({
      templateUrl: 'myMesureContent.html',
      controller: MesureInstanceCtrl
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency. It is not the same as the $modal service used above.
  var MesureInstanceCtrl = function ($rootScope, $scope, $modalInstance) {
    $scope.formData = $scope.mesure;
    $scope.activities = $rootScope.activities;
    $scope.contextes = $rootScope.contextes;

    if ($rootScope.newItem === true) { 
       delete $scope.formData._id;
    }

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
      'year-format': "'yyyy'",
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
  $http.put('/REST/mesures/'+$scope.formData._id, $scope.formData)
  .success(function(data) {
  });
  }else{
  $http.post('/REST/mesures', $scope.formData)
  .success(function(data) {
  });
}


  if ($rootScope.opendata == 'activities') $rootScope.activities.push($scope.formData);
  if ($rootScope.opendata == 'axes')  $rootScope.axes.push($scope.formData);
  if ($rootScope.opendata == 'contextes')  $rootScope.contextes.push($scope.formData);
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};
};



  /**
   * Displaydetails
   */

   $scope.DisplayDetails = function (tache) {
    $scope.mesures = tache.Mesures;
  };



});
