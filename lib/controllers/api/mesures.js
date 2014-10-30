
var async = require('async');
var type = 'mesure';
var dbModule = require('./dbModule.js');
var Q = require('q');
var contextesId = [];
var ActivitiesId = [];

// Include underscore library
var _ = require('underscore')._;

/**
 *  REST 
 */ 

 exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbMesures.find({}, function (err, docs) {
		res.send(docs);
	});
 }; 
 

 exports.findByTask = function(req, res) {
	var idC = req.params.idC;
	var idA = req.params.idA;


	Q()
		.then(function(){
			// Find all contextes in the collection
			// -------------------------------------
			var deferred = Q.defer();
			dbContextes.find({}, function (err, docs) {
				if (err) deferred.reject(err);
		    	else {

					var allContextes = dbModule.buildHierarchy(docs,'list');
					var contexteName = _.filter(docs, function(contexte){ return contexte._id===idC;}); // récupère le nom long du contexte
					var contexteNames = _.filter(docs, function(contexte){ return contexte.longname.indexOf(contexteName[0].longname)>=0;}); // récupère les enfants du nom long
					 contextesId = _.pluck(contexteNames, "_id"); // crèe un tableau des Ids utilisé dans le filtre des mesures à récupérer.
					 console.log(contextesId + "/1");
					deferred.resolve(contextesId);
				}
			});
		    return deferred.promise;
	    })

		.then(function(){
			// Find all activities in the collection
			// -------------------------------------
			var deferred = Q.defer();
			dbActivities.find({}, function (err, docs) {
				if (err) deferred.reject(err);
		    	else {

					var allActivities = dbModule.buildHierarchy(docs,'list');
					var ActivitieName = _.filter(docs, function(Activitie){ return Activitie._id===idA;}); // récupère le nom long du Activitie
					var ActivitieNames = _.filter(docs, function(Activitie){ return Activitie.longname.indexOf(ActivitieName[0].longname)>=0;}); // récupère les enfants du nom long
					 ActivitiesId = _.pluck(ActivitieNames, "_id"); // crèe un tableau des Ids utilisé dans le filtre des mesures à récupérer.
					 console.log(ActivitiesId + "/1");
					deferred.resolve(ActivitiesId);
				}
			});
		    return deferred.promise;
	    })

		.finally(function(){
			// Find all mesures in the collection
			// -------------------------------------
			var deferred = Q.defer();
			dbMesures.find({refcontexte:{ $in: contextesId},refActivity:{ $in: ActivitiesId}}).sort({ date: 1 }).exec(function (err, mesures) {
				if (err) deferred.reject(err);
		    	else {
					console.log(mesures + "/3");
					res.send(mesures);
					deferred.resolve(mesures);
				}
			});
		    return deferred.promise;
		})

function findContextChilds(idC){
	return function(){
    	var deferred = Q.defer();
		// Find all documents in the collection
		dbContextes.find({}, function (err, docs) {
			if (err) deferred.reject(err);
	    	else {

				var allContextes = dbModule.buildHierarchy(docs,'list');
				var contexteName = _.filter(docs, function(contexte){ return contexte._id===idC;}); // récupère le nom long du contexte
				var contexteNames = _.filter(docs, function(contexte){ return contexte.longname.indexOf(contexteName[0].longname)>=0;}); // récupère les enfants du nom long
				 contextesId = _.pluck(contexteNames, "_id"); // crèe un tableau des Ids utilisé dans le filtre des mesures à récupérer.
				console.log(contextesId + "/1");
				deferred.resolve(contextesId);
			}
		});
	    return deferred.promise;
	}
}

function findMesures(){
    var deferred = Q.defer();
	// Find all documents in the collection
	console.log(contextesId + "/2");
	console.log(idA + "/2");
	dbMesures.find({refcontexte:{ $in: contextesId},refActivity:idA}).sort({ date: 1 }).exec(function (err, mesures) {
		if (err) deferred.reject(err);
    	else {

			deferred.resolve(mesures);
		}
	});
    return deferred.promise;
}


 };





 exports.findByIndicateur = function(req, res) {
	var idC = req.params.idC;
	var idA = req.params.idA;

	// Find all documents in the collection
	dbMesures.find({refcontexte:idC,refActivity:idA}).sort({ date: 1 }).exec(function (err, docs) {
		res.send(docs);
	});
	};


 exports.findById = function(req, res) {
	
 };

 exports.add = function(req, res) {
	dbMesures.insert(req.body, function (err, newDocs) {
		console.log('Adding ' + type +': ' + JSON.stringify(req.body));
	});
 };

 exports.update = function(req, res) {
	var id = req.params.id;
	dbMesures.update({_id: id}, req.body, {}, function (err, newDocs) {
		console.log('Updating ' + type +': ' + JSON.stringify(req.body));
	});
 };