var dbModule = require('./dbModule.js');

/**
 *  REST 
 */

 exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbContextes.find({}, function (err, docs) {
    	res.send(dbModule.buildHierarchy(docs,'list'));
	});
 };
 
 exports.findById = function(req, res) {
 	res.send({id:req.params.id, name: "The Name", description: "description"});
 };

 exports.addcontexte = function(req, res) {

 	var contexte = req.body;
 	dbContextes.insert(contexte, function (err, newDocs) {
 		console.log('Adding contexte: ' + JSON.stringify(contexte));
 	});

 };