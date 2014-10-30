
var type = 'taches'
/**
 *  REST 
 */

 exports.findAll = function(req, res) {
	// Find all documents in the collection
	dbTaches.find({}, function (err, docs) {
		res.send(docs);
	});
 };
 
 exports.findById = function(req, res) {
 	
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


