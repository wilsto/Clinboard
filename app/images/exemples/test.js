  $scope.LoadWidgets = function(){
    $http.get('/REST/taches').success(function (data) {
      $scope.tasks = [];
      // decoder le contexte et les activités pour les tasks
      //Join json
      _.each(_.keys(data), function(key) {
        $scope.tasks[data[key]._id] = data[key];

        var even = _.where($rootScope.contextes, {id: $scope.tasks[data[key]._id].refContexte});
        $scope.tasks[data[key]._id].Contexte = even[0];
        var even = _.where($rootScope.activities, {id: $scope.tasks[data[key]._id].refActivity});
        $scope.tasks[data[key]._id].Activity = even[0];

        // Aller chercher les mesures par contexte et les activités 
        $http.get('/REST/mesures/bytask/'+$scope.tasks[data[key]._id].refContexte+'/'+$scope.tasks[data[key]._id].refActivity).success(function (mesures) {
          $scope.tasks[data[key]._id].Mesures = mesures;
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

$scope.$watch('tasks', function(tasks){
  console.log('task',tasks);
     $scope.taches = [];
      _.each(_.keys(tasks), function(key) {
        $scope.taches.push(tasks[key]);
      });
  }, true);
