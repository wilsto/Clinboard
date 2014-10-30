
var dbModule = require('./dbModule.js');

/**
 *  REST 
 */

 exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbAxes.find({}, function (err, docs) {
    	res.send(dbModule.buildHierarchy(docs,'list'));
	});
 };
 
 exports.findById = function(req, res) {
 	res.send({id:req.params.id, name: "The Name", description: "description"});
 };

 exports.addaxe = function(req, res) {

 	var axe = req.body;
 	console.log('Adding axe: ' + JSON.stringify(axe));

 	dbAxes.insert(axe, function (err, newDocs) {
 	});

 };