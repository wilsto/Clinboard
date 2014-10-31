'use strict';

angular.module('clinBoardApp')
.controller('dashCtrl', function ($rootScope, $scope, $modal, $http, $dialogs, $filter, $q) {
	$scope.Math = window.Math;

	$scope.gridsterOpts = {
		margins: [20, 20],
		draggable: {
			enabled: true
		},
		resizable: {
			enabled: true
		}
	};

	// these map directly to gridsterItem options
	$scope.standardItems = [
	{ sizeX: 2, sizeY: 1, row: 0, col: 0, name:"Dépôt Ivabradine US (AMGEN) : Packages", value:"5", valuePCT:"80%" },
	{ sizeX: 2, sizeY: 2, row: 0, col: 2, name:"Dépôt Ivabradine US (AMGEN) ", value:"5", valuePCT:"80%" },
	{ sizeX: 1, sizeY: 1, row: 0, col: 4, name:"Dépôt Ivabradine US (AMGEN) ", value:"5", valuePCT:"80%"  },
	{ sizeX: 1, sizeY: 1, row: 0, col: 5, name:"Dépôt Ivabradine US (AMGEN) : Packages", ids:["",""]},
	{ sizeX: 2, sizeY: 1, row: 1, col: 0 },
	{ sizeX: 1, sizeY: 1, row: 1, col: 4 },
	{ sizeX: 1, sizeY: 1, row: 1, col: 5 },
	{ sizeX: 1, sizeY: 1, row: 2, col: 0 },
	{ sizeX: 2, sizeY: 1, row: 2, col: 1 },
	{ sizeX: 1, sizeY: 1, row: 2, col: 3 },
	{ sizeX: 1, sizeY: 1, row: 2, col: 4 },
	{ sizeX: 1, sizeY: 1, row: 2, col: 5 }
	];


	$scope.gridContentColor = function(item){

		$scope.color='gridContentGreen';
		return $scope.color;
	};

	$scope.gridFooterColor = function(item){
		$scope.color='gridFooterGreen';
		return $scope.color;
	};


	$scope.exampleData = [
	{
		"key": "Series 1",
		"values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] , [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] , [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] , [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] , [ 1075525200000 , 26.743156781239] , [ 1078030800000 , 29.597478802228] , [ 1080709200000 , 30.831697585341] , [ 1083297600000 , 28.054068024708] , [ 1085976000000 , 29.294079423832] , [ 1088568000000 , 30.269264061274] , [ 1091246400000 , 24.934526898906] , [ 1093924800000 , 24.265982759406] , [ 1096516800000 , 27.217794897473] , [ 1099195200000 , 30.802601992077] , [ 1101790800000 , 36.331003758254] , [ 1104469200000 , 43.142498700060] , [ 1107147600000 , 40.558263931958] , [ 1109566800000 , 42.543622385800] , [ 1112245200000 , 41.683584710331] , [ 1114833600000 , 36.375367302328] , [ 1117512000000 , 40.719688980730] , [ 1120104000000 , 43.897963036919] , [ 1122782400000 , 49.797033975368] , [ 1125460800000 , 47.085993935989] , [ 1128052800000 , 46.601972859745] , [ 1130734800000 , 41.567784572762] , [ 1133326800000 , 47.296923737245] , [ 1136005200000 , 47.642969612080] , [ 1138683600000 , 50.781515820954] , [ 1141102800000 , 52.600229204305] , [ 1143781200000 , 55.599684490628] , [ 1146369600000 , 57.920388436633] , [ 1149048000000 , 53.503593218971] , [ 1151640000000 , 53.522973979964] , [ 1154318400000 , 49.846822298548] , [ 1156996800000 , 54.721341614650] , [ 1159588800000 , 58.186236223191] , [ 1162270800000 , 63.908065540997] , [ 1164862800000 , 69.767285129367] , [ 1167541200000 , 72.534013373592] , [ 1170219600000 , 77.991819436573] , [ 1172638800000 , 78.143584404990] , [ 1175313600000 , 83.702398665233] , [ 1177905600000 , 91.140859312418] , [ 1180584000000 , 98.590960607028] , [ 1183176000000 , 96.245634754228] , [ 1185854400000 , 92.326364432615] , [ 1188532800000 , 97.068765332230] , [ 1191124800000 , 105.81025556260] , [ 1193803200000 , 114.38348777791] , [ 1196398800000 , 103.59604949810] , [ 1199077200000 , 101.72488429307] , [ 1201755600000 , 89.840147735028] , [ 1204261200000 , 86.963597532664] , [ 1206936000000 , 84.075505208491] , [ 1209528000000 , 93.170105645831] , [ 1212206400000 , 103.62838083121] , [ 1214798400000 , 87.458241365091] , [ 1217476800000 , 85.808374141319] , [ 1220155200000 , 93.158054469193] , [ 1222747200000 , 65.973252382360] , [ 1225425600000 , 44.580686638224] , [ 1228021200000 , 36.418977140128] , [ 1230699600000 , 38.727678144761] , [ 1233378000000 , 36.692674173387] , [ 1235797200000 , 30.033022809480] , [ 1238472000000 , 36.707532162718] , [ 1241064000000 , 52.191457688389] , [ 1243742400000 , 56.357883979735] , [ 1246334400000 , 57.629002180305] , [ 1249012800000 , 66.650985790166] , [ 1251691200000 , 70.839243432186] , [ 1254283200000 , 78.731998491499] , [ 1256961600000 , 72.375528540349] , [ 1259557200000 , 81.738387881630] , [ 1262235600000 , 87.539792394232] , [ 1264914000000 , 84.320762662273] , [ 1267333200000 , 90.621278391889] , [ 1270008000000 , 102.47144881651] , [ 1272600000000 , 102.79320353429] , [ 1275278400000 , 90.529736050479] , [ 1277870400000 , 76.580859994531] , [ 1280548800000 , 86.548979376972] , [ 1283227200000 , 81.879653334089] , [ 1285819200000 , 101.72550015956] , [ 1288497600000 , 107.97964852260] , [ 1291093200000 , 106.16240630785] , [ 1293771600000 , 114.84268599533] , [ 1296450000000 , 121.60793322282] , [ 1298869200000 , 133.41437346605] , [ 1301544000000 , 125.46646042904] , [ 1304136000000 , 129.76784954301] , [ 1306814400000 , 128.15798861044] , [ 1309406400000 , 121.92388706072] , [ 1312084800000 , 116.70036100870] , [ 1314763200000 , 88.367701837033] , [ 1317355200000 , 59.159665765725] , [ 1320033600000 , 79.793568139753] , [ 1322629200000 , 75.903834028417] , [ 1325307600000 , 72.704218209157] , [ 1327986000000 , 84.936990804097] , [ 1330491600000 , 93.388148670744]]
	}];

	$scope.colorFunction = function() {
		return function(d, i) {
			return '#FFFFFF'
		};
	}


/**
* Retrieve data
*/

$scope.LoadWidgets = function(){
   	$http.get('/REST/indicateurs').success(function (data) {

		$scope.widgets = data;

		_.each($scope.widgets, function(rowdata, index) {  // pour chaque enregistrement
			// decoder le contexte et les activités pour les indicateurs
			var even = _.where($rootScope.contextes, {id: rowdata.refContexte});
			rowdata.Contexte = even[0].name;
			even = _.where($rootScope.activities, {id: rowdata.refActivity});
			rowdata.Activity = even[0].name;
			even = _.where($rootScope.axes, {id: rowdata.refAxe});
			rowdata.Axe = even[0].name;

			if (rowdata.Activity.indexOf($rootScope.perimeter.Activity) <0) { 
				// a ne pas sélectionner
				$scope.widgets[index].toDisplay = false;
			} else {
				// on va plus loin en allant chercher les mesures 
				$scope.widgets[index].toDisplay = true;
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
			}

			//console.log($scope.widgets);
			});
		
		//Fin Get
	});
};

$scope.LoadWidgets();

$scope.$on('perimeterChanged', function(event, args) {
	$scope.LoadWidgets();
});
  // another controller or even directive
  

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

