
var dbModule = require('./dbModule.js');
var Q = require('q');
var type = 'indicateurs';
var _ = require('lodash');

/**
 *  REST 
 */

exports.findAll = function(req, res) {
	// Find all documents in the collection
	
  var deferred = Q.defer();
  var promise = Q.all([
    	dbActivities.find({}, function (err, docs) {
        	activities = dbModule.buildHierarchy(docs,'list');
		}),
		dbAxes.find({}, function (err, docs) {
        	axes = dbModule.buildHierarchy(docs,'list');
		}),
		dbContextes.find({}, function (err, docs) {
        	contextes = dbModule.buildHierarchy(docs,'list');
		}),
		dbMesures.find({}, function (err, docs) {
			mesures = docs;
		}),
		dbTaches.find({}, function (err, docs) {
			_.each(docs, function(rowdata, index) {  // pour chaque enregistrement
				var even = _.where(contextes, {id: rowdata.refContexte});
				rowdata.Contexte = even[0].name;
				console.log(rowdata.Contexte);
				even = _.where(activities, {id: rowdata.refActivity});
				rowdata.Activity = even[0].name;
			});
			tasks = docs;
		})
    ]);

  promise.then(function () {
	dbIndicateurs.find({}, function (err, docs) {
		_.each(docs, function(rowdata, index) {  // pour chaque enregistrement
			
			//ajouter des infos
			rowdata.mesureName = rowdata.type;
			rowdata._type = 1;

			// decoder le contexte et les activités pour les indicateurs
			var even = _.where(contextes, {id: rowdata.refContexte});
			rowdata.Contexte = even[0].name;
			even = _.where(activities, {id: rowdata.refActivity});
			rowdata.Activity = even[0].name;
			even = _.where(axes, {id: rowdata.refAxe});
			rowdata.Axe = even[0].name;

			//attacher les taches	
			var even = _.filter(tasks, function(task){ if (typeof  task.Contexte !== 'undefined') {return task.Contexte.indexOf(rowdata.Contexte)>=0;}}); // récupère les enfants du nom long
			var even = _.filter(even, function(task){ if (typeof  task.Activity !== 'undefined') {return task.Activity.indexOf(rowdata.Activity)>=0;}}); // récupère les enfants du nom long
			rowdata.tasks = even;
			rowdata.tasksNb = even.length;

			// attacher les mesures
			var even = _.filter(mesures, function(mesure){ if (typeof  mesure.Contexte !== 'undefined') {return mesure.Contexte.indexOf(rowdata.Contexte)>=0;}}); // récupère les enfants du nom long
			var even = _.filter(even, function(mesure){ if (typeof  mesure.Activity !== 'undefined') {return mesure.Activity.indexOf(rowdata.Activity)>=0;}}); // récupère les enfants du nom long
			rowdata.mesures = even;
			rowdata.mesuresNb = even.length;

			//Valeurs
			if (typeof rowdata.typedetails !== "undefined") {
				var checksType = rowdata.typedetails.split(' + ');
			}
			if (typeof rowdata.reftypedetails !== "undefined") {
				var checksRefType = rowdata.reftypedetails.split(' + ');
			}

			// Réaliser des calculs
			switch(rowdata.action) {
				case 'Compte':
					// valeurs principales
					var even = _.filter(rowdata.mesures, function(mesure){ 
						if (typeof checksType !== "undefined") {
							var blnFind = false;
							_.each(checksType, function(check) {
					         if (mesure[rowdata.type] == check) { blnFind = true } ; // avec indexOf pour le like
					     });
							return blnFind; 
						} else {
							return true;
						}
					});
					rowdata.mesureVal = even.length;

					// valeurs références
					var evenRef = _.filter(rowdata.mesures, function(mesure){ 
						if (typeof checksRefType !== "undefined") {                                
							var blnFind = false;
							_.each(checksRefType, function(check) {
					         if (mesure[rowdata.reftype] == check) { blnFind = true } ; // avec indexOf pour le like
					     });
							return blnFind;
						} else {
							return true;
						}
					});
					rowdata.reference = evenRef.length;
					break;
				default :
					if (typeof rowdata.mesures[rowdata.mesures.length - 1] !== "undefined") { rowdata.mesureVal = rowdata.mesures[rowdata.mesures.length - 1][rowdata.type];}
					if (typeof rowdata.mesures[rowdata.mesures.length - 2] !== "undefined") { rowdata.mesurePrevVal = rowdata.mesures[rowdata.mesures.length - 2][rowdata.type];}
					rowdata.reference = 100;                              
			}

			//calcul de l'age de la dernière mesure
			if (typeof rowdata.mesures[mesures.length - 1] !== "undefined") {
				var date1 = new Date(rowdata.mesures[mesures.length - 1].date);																
				var date2 = new Date();
				var diff = dateDiff(date1, date2);
				rowdata.ageVal = diff.day ;
			}
			rowdata.percentObjectif = (rowdata.mesureVal /  rowdata.reference) * 100 +'%';
		});
		res.send(docs);

	});
  });
};
 
exports.findById = function(req, res) {
	var id = req.params.id;
	dbIndicateurs.find({_id: id}, function (err, docs) {
		res.send(docs);
	});
};


 exports.add = function(req, res) {
 	dbIndicateurs.insert(req.body, function (err, newDocs) {
 		console.log('Adding ' + type +': ' + JSON.stringify(req.body));
 	});
 };

 exports.update = function(req, res) {
 	var id = req.params.id;
 	console.log('req.body: ',req.body);
 	dbIndicateurs.update({_id: id}, req.body, {}, function (err, newDocs) {
 		console.log('Updating '+ err + type +': ' + JSON.stringify(req.body));
 	});
 };

  exports.updateField = function(req, res) {
 	var id = req.params.id;
 	dbIndicateurs.update({_id: id}, { $set: req.body }, {}, function (err, newDocs) {
 		console.log('Updating '+ type +': ', req.params.id, req.body);
 		res.send(true);
 	});
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