
var type = 'dashboards'

/**
 *  REST 
 */

exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbDashboards.find({}, function (err, docs) {
		res.send(docs);
	});
};
 
exports.findById = function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
};


 exports.add = function(req, res) {
 	dbDashboards.insert(req.body, function (err, newDocs) {
 		console.log('Adding ' + type +': ' + JSON.stringify(req.body));
 	});
 };

 exports.update = function(req, res) {
 	var id = req.params.id;
 	console.log('req.body: ',req.body);
 	dbDashboards.update({_id: id}, req.body, {}, function (err, newDocs) {
 		console.log('Updating '+ err + type +': ' + JSON.stringify(req.body));
 	});
 };

  exports.updateField = function(req, res) {
 	var id = req.params.id;
 	dbDashboards.update({_id: id}, { $set: req.body }, {}, function (err, newDocs) {
 		console.log('Updating '+ type +': ', req.params.id, req.body);
 		res.send(true);
 	});
 };