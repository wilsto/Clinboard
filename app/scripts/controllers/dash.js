'use strict';

angular.module('clinBoardApp')
.controller('dashCtrl', function ($rootScope, $scope, $modal, $http, $dialogs, $filter, $q, $compile, $routeParams,$timeout) {

		$scope.summary =[];

		$http.get('/REST/dashboards/'+$routeParams.dashId).success(function (data) {
/*			$scope.perimeter = data[0];
*/			$rootScope.perimeter = data[0];
		});

	//Initialize & config popover controls
	$('#dashboard-report-supervision').popover({ html : true })
	    .click(function(ev) {
	     //this is workaround needed in order to make ng-click work inside of popover
	     $scope.$apply(function () {
	       	$scope.perimeter = $rootScope.perimeter;
	     	$compile($('.popover.in').contents())($scope);
         });
	});

/**
* Retrieve data
*/

var data = [ {type: "A", val:2},
             {type: "B", val:3},
             {type: "A", val:1},
             {type: "C", val:5} ];


var groups = _(data).groupBy('type');

var out = _(groups).map(function(g, key) {
  return { 
     type: key, 
     val: _(g).reduce(function(m,x) { 
       return m + x.val;
     }, 0) 
  };
});




/*cumulative */
var myarray = [5, 10, 3, 2];
var result = myarray.concat();
for (var i = 0; i < myarray.length; i++){
    result[i] = myarray.slice(0, i + 1).reduce(function(p, i){ return p + i; });
}





var data = [{
    "USER_NAME": "User1",
        "LAST_SUCCESSFUL_CONNECT": "2013-10-27T23:00:00.000Z"
}, {
    "USER_NAME": "User2",
        "LAST_SUCCESSFUL_CONNECT": "2013-11-11T23:00:00.000Z"
}, {
    "USER_NAME": "User3",
        "LAST_SUCCESSFUL_CONNECT": "2013-10-21T23:00:00.000Z"
}, {
    "USER_NAME": "User4",
        "LAST_SUCCESSFUL_CONNECT": "2013-10-01T23:00:00.000Z"
}];

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

var map_result = _.map(data, function (item) {
    var d = new Date(new Number(new Date(item.LAST_SUCCESSFUL_CONNECT)));
    var month = monthNames[d.getMonth()] + ", " + d.getFullYear();
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


$scope.LoadWidgets = function(){
   	$http.get('/REST/indicateurs').success(function (data) {

		$scope.widgets = data;

		/* ------------------------*/
		$scope.summary.indicateurs = {list:[],sum:[]}
		$scope.summary.tasks = {list:[],sum:[]}
		$scope.summary.metrics = {list:[],sum:[]}
		$scope.summary.trust = {list:[],sum:[]}
		$scope.summary.alerts = {list:[],sum:[]}
		$scope.summary.goals = {list:[],sum:[]}
		/* ------------------------*/

		_.each($scope.widgets, function(rowdata, index) {  // pour chaque enregistrement
			
			// decoder le contexte et les activités pour les indicateurs
			var even = _.where($rootScope.contextes, {id: rowdata.refContexte});
			rowdata.Contexte = even[0].name;
			even = _.where($rootScope.activities, {id: rowdata.refActivity});
			rowdata.Activity = even[0].name;
			even = _.where($rootScope.axes, {id: rowdata.refAxe});
			rowdata.Axe = even[0].name;

			var blnContexte = (typeof $rootScope.perimeter.Contexte == "undefined" || rowdata.Contexte.indexOf($rootScope.perimeter.Contexte) >=0 ) ? true : false;
			var blnActivity = (typeof $rootScope.perimeter.Activity == "undefined" || rowdata.Activity.indexOf($rootScope.perimeter.Activity) >=0 ) ? true : false;
			var blnAxe = (typeof $rootScope.perimeter.Axe == "undefined" || rowdata.Axe.indexOf($rootScope.perimeter.Axe) >=0 ) ? true : false;
			var blnCategory = ($rootScope.perimeter.category[0] == true && rowdata.category == 'Objectif' || $rootScope.perimeter.category[1] == true && rowdata.category == 'Alerte') ? true : false;

			if (blnContexte && blnActivity && blnAxe && blnCategory) { 

				// on va plus loin en allant chercher les mesures 
				$scope.widgets[index].toDisplay = true;
				/* ------------------------*/
				$scope.summary.indicateurs.list.push($scope.widgets[index].name);

				$http.get('/REST/mesures/bytask/'+rowdata.refContexte+'/'+rowdata.refActivity).success(function (mesures) {

					$scope.widgets[index]._type = 1;

					$scope.widgets[index]._mesures = mesures;
					$scope.widgets[index].mesuresNb = mesures.length;

					// decoder le contexte et les activités pour les mesures
					_.each(_.keys($scope.widgets[index]._mesures ), function(keyM) {
						var even = _.where($rootScope.contextes, {id: $scope.widgets[index]._mesures[keyM].refcontexte});
						$scope.widgets[index]._mesures[keyM].Contexte = even[0].name;
						var even = _.where($rootScope.activities, {id: $scope.widgets[index]._mesures[keyM].refActivity});
						$scope.widgets[index]._mesures[keyM].Activity = even[0].name;
						/* ------------------------*/
						$scope.summary.metrics.list.push($scope.widgets[index]._mesures[keyM].date);
					});

					$scope.widgets[index].mesureName = $scope.widgets[index].type;

					//Valeurs
					if (typeof $scope.widgets[index].typedetails !== "undefined") {
					var checksType = $scope.widgets[index].typedetails.split(' + ');
					}
					if (typeof $scope.widgets[index].reftypedetails !== "undefined") {
					var checksRefType = $scope.widgets[index].reftypedetails.split(' + ');
					}

					switch($scope.widgets[index].action) {
						case 'Compte':
							// valeurs principales
							var even = _.filter(mesures, function(mesure){ 
								if (typeof checksType !== "undefined") {
									var blnFind = false;
									_.each(checksType, function(check) {
							         if (mesure[$scope.widgets[index].type] == check) { blnFind = true } ; // avec indexOf pour le like
							     });
									return blnFind; 
								} else {
									return true;
								}
							});
							$scope.widgets[index].mesureVal = even.length;

							// valeurs références
							var evenRef = _.filter(mesures, function(mesure){ 
								if (typeof checksRefType !== "undefined") {                                
									var blnFind = false;
									_.each(checksRefType, function(check) {
							         if (mesure[$scope.widgets[index].reftype] == check) { blnFind = true } ; // avec indexOf pour le like
							     });
									return blnFind;
								} else {
									return true;
								}
							});
							$scope.widgets[index].reference = evenRef.length;
							break;
						default :
							$scope.widgets[index].mesureVal = mesures[mesures.length - 1][$scope.widgets[index].type];
							if (mesures.length > 1) $scope.widgets[index]._mesurePrevVal = mesures[mesures.length - 2][$scope.widgets[index].type];
							$scope.widgets[index].reference = 100;                              
					}

					//calcul de l'age de la dernière mesure
					if (typeof mesures[mesures.length - 1] !== "undefined") {
						var date1 = new Date(mesures[mesures.length - 1].date);																
						var date2 = new Date();
						var diff = dateDiff(date1, date2);
						$scope.widgets[index].ageVal = diff.day ;
					}
					$scope.widgets[index].percentObjectif = ($scope.widgets[index].mesureVal /  $scope.widgets[index].reference) * 100 +'%';
				});
			} else {
				// a ne pas sélectionner
				$scope.widgets[index].toDisplay = false;


			}

			//console.log($scope.widgets);
			});
		
		//Fin Get
		

	});
};

$scope.LoadWidgets();


// une fois le rendu terminé
$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    $timeout(function() {
var data = $scope.summary.metrics.list;
	   console.log('$scope.summary.metrics.list',$scope.summary.metrics);

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

var map_result = _.map(data, function (item) {
	   console.log(item);
    var d = new Date(new Number(new Date(item)));
    var month = monthNames[d.getMonth()] + ", " + d.getFullYear();
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
    console.log(result);

    console.log($scope.summary);
        }, 3000);
});

$scope.myFilter = function (item) { 

    return item.toDisplay; 
};

$scope.openIndicateur = function (Indicateur) {
	$rootScope.Indicateur = Indicateur;
	var modalInstance = $modal.open({
		templateUrl: '../../views/modals/myIndicateurContent.html',
		controller: IndicateurInstanceCtrl
	});
};

$scope.expandWidget = function (Indicateur) {
	var nextHeight = ($('#'+Indicateur._id).css('height') == '430px') ? '200px':'430px';
	$('#'+Indicateur._id).animate({height: nextHeight}, 400);
	$('#'+Indicateur._id + ' .cardBottom').toggle(400);
};


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


});

