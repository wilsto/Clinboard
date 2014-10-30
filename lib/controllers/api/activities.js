var dbModule = require('./dbModule.js');

/**
 *  REST 
 */

 exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbActivities.find({}, function (err, docs) {
        res.send(dbModule.buildHierarchy(docs,'list'));
	});
 };
 
 exports.findAllTreeview = function(req, res) {
    // Find all documents in the collection
    dbActivities.find({}, function (err, docs) {
    res.send(dbModule.buildHierarchy(docs,'Treeview'));
    });
 };

 exports.findById = function(req, res) {
 	res.send({id:req.params.id, name: "The Name", description: "description"});
 };

 exports.addactivity = function(req, res) {

 	var activity = req.body;
 	console.log('Adding activity: ' + JSON.stringify(activity));

 	dbActivities.insert(activity, function (err, newDocs) {
 	});

 };