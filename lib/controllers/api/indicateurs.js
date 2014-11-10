
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
		})
    ]);

  promise.then(function () {
	dbIndicateurs.find({}, function (err, docs) {
		_.each(docs, function(rowdata, index) {  // pour chaque enregistrement
			
			// decoder le contexte et les activités pour les indicateurs
			var even = _.where(contextes, {id: rowdata.refContexte});
			rowdata.Contexte = even[0].name;
			even = _.where(activities, {id: rowdata.refActivity});
			rowdata.Activity = even[0].name;
			even = _.where(axes, {id: rowdata.refAxe});
			rowdata.Axe = even[0].name;

			//attacher les taches
			
			
			// attacher les mesures
			var even = _.filter(mesures, function(mesure){ if (typeof  mesure.Contexte !== 'undefined') {return mesure.Contexte.indexOf(rowdata.Contexte)>=0;}}); // récupère les enfants du nom long
			rowdata.mesures = even;

			//res.send(even);
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