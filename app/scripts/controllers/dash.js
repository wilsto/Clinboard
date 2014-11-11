'use strict';

angular.module('clinBoardApp')
.controller('dashCtrl', function ($rootScope, $scope, $modal, $http, $dialogs, $filter, indicateurs,dashboards,calLibrary) {

	$rootScope.perimeter = dashboards.data[0];

	//Initialize & config popover controls
	$('#dashboard-report-supervision').popover({ html : true })
	    .click(function(ev) {
	     //this is workaround needed in order to make ng-click work inside of popover
	     $scope.$apply(function () {
	       	$scope.perimeter = $rootScope.perimeter;
	     	$compile($('.popover.in').contents())($scope);
         });
	});

$scope.LoadWidgets = function(){

		$scope.indicateurs = indicateurs.data;

		$scope.summary =[];

		/* ------------------------*/
		$scope.summary.indicateurs = {list:[],sum:[]}
		$scope.summary.tasks = {list:[],sum:[]}
		$scope.summary.metrics = {list:[],sum:[]}
		$scope.summary.trust = {list:[],sum:[]}
		$scope.summary.alerts = {list:[],sum:[]}
		$scope.summary.goals = {list:[],sum:[]}
		/* ------------------------*/

		_.each($scope.indicateurs, function(rowdata, index) {  // pour chaque enregistrement
			var blnContexte = (typeof $rootScope.perimeter.Contexte == "undefined" || rowdata.Contexte.indexOf($rootScope.perimeter.Contexte) >=0 ) ? true : false;
			var blnActivity = (typeof $rootScope.perimeter.Activity == "undefined" || rowdata.Activity.indexOf($rootScope.perimeter.Activity) >=0 ) ? true : false;
			var blnAxe = (typeof $rootScope.perimeter.Axe == "undefined" || rowdata.Axe.indexOf($rootScope.perimeter.Axe) >=0 ) ? true : false;
			var blnCategory = ($rootScope.perimeter.category[0] == true && rowdata.category == 'Objectif' || $rootScope.perimeter.category[1] == true && rowdata.category == 'Alerte') ? true : false;

			var toDisplay =  (blnContexte && blnActivity && blnAxe && blnCategory) ? true :false;
			$scope.indicateurs[index].toDisplay=toDisplay;
			if (toDisplay) {
				$scope.summary.indicateurs.list.push(rowdata.name);
				$.each(rowdata.mesures, function(index, mesure) {
					$scope.summary.metrics.list.push(mesure);
					if (typeof mesure.confiance !== 'undefined') {$scope.summary.trust.list.push(parseInt(mesure.confiance));}
				});
				$.each(rowdata.tasks, function(index, task) {
					$scope.summary.tasks.list.push(task);
				});
				if (typeof rowdata.percentObjectif !== 'undefined' && !isNaN(parseInt(rowdata.percentObjectif)) ) {$scope.summary.goals.list.push(parseInt(rowdata.percentObjectif));}

			}
		});
	
};

$scope.LoadWidgets();


// une fois le rendu terminé
$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {


    $(".chrono.bar-chart").peity("bar", {
        height: 30,
        width: 100,
         fill: function(value) {
            return value > 10 ? "green" : "red"
          }
    }).show();

    Index.initPeityElements();


   // var resultVal = calLibrary.getSumByMonth( $scope.indicator.mesureVal, 'date');
   // var resultRef = calLibrary.getSumByMonth( $scope.indicator.mesureRef, 'date');


	var data = $scope.summary.metrics.list;

	var monthNames = ["January", "February", "March", "April", "May", "June",
	    "July", "August", "September", "October", "November", "December"];

	var map_result = _.map(data, function (item) {
	    var d = new Date(new Number(new Date(item.date)));
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

	$scope.summary.metrics.sum = result;

	$scope.summary.trust.sum =_.reduce($scope.summary.trust.list, function(sum, num)
		{
				return sum + num;
		}, 0) / $scope.summary.trust.list.length;


	$scope.summary.goals.sum =_.reduce($scope.summary.goals.list, function(sum, num)
		{
				return sum + num;
		}, 0) / $scope.summary.goals.list.length;


	console.log($scope.summary);
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

