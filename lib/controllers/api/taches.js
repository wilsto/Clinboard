
var type = 'taches';

var dbModule = require('./dbModule.js');
var Q = require('q');
var _ = require('lodash');

/**
 *  REST 
 */

 exports.find = function(req, res) {
    // Find all documents in the collection
   var idSelector = (typeof req.params.id == 'undefined') ? null: {_id: req.params.id};

	
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
             _.each(docs, function(rowdata, index) {  // pour chaque enregistrement

                var even = _.where(contextes, {id: rowdata.refContexte});
                rowdata.Contexte = even[0].name;
                even = _.where(activities, {id: rowdata.refActivity});
                rowdata.Activity = even[0].name;
            });
            mesures = docs;
        })
    ]);

  promise.then(function () {
    dbTaches.find(idSelector, function (err, docs) {
        _.each(docs, function(rowdata, index) {  // pour chaque enregistrement
            
            // decoder le contexte et les activités pour les indicateurs
            var even = _.where(contextes, {id: rowdata.refContexte});
            rowdata.Contexte = even[0].name;
            even = _.where(activities, {id: rowdata.refActivity});
            rowdata.Activity = even[0].name;

            // attacher les mesures
            var even = _.filter(mesures, function(mesure){ if (typeof  mesure.Contexte !== 'undefined') {return mesure.Contexte.indexOf(rowdata.Contexte)>=0;}}); // récupère les enfants du nom long
            var even = _.filter(even, function(mesure){ if (typeof  mesure.Activity !== 'undefined') {return mesure.Activity.indexOf(rowdata.Activity)>=0;}}); // récupère les enfants du nom long
            rowdata.mesures = even;
            rowdata.mesuresNb = even.length;

            //ajouter des infos


        });
        res.send(docs);

    });
  });
};
 
 exports.findById = function(req, res) {
    var id = req.params.id;
 	dbTaches.find({_id: id}, function (err, docs) {
        res.send(docs);
    });
 };

 exports.add = function(req, res) {
 	dbTaches.insert(req.body, function (err, newDocs) {
 		console.log('Adding ' + type +': ' + JSON.stringify(req.body));
 	});
 };

exports.update = function(req, res) {
    var id = req.params.id;
    dbTaches.update({_id: id}, req.body, {}, function (err, newDocs) {
        console.log('Updating ' + type +': ' + JSON.stringify(req.body));
    });
};
exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting task: ' + id);
    dbTaches.remove({_id: id}, {}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' task(s) deleted');
            res.send(req.body);
        }
    });
};


