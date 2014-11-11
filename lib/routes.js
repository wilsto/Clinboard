'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);

  var dashboards = require('./controllers/api/dashboards');
  app.get('/REST/dashboards', dashboards.findAll);
  app.get('/REST/dashboards/:id', dashboards.findById);
  app.post('/REST/dashboards', dashboards.add);
  app.post('/REST/dashboards/:id', dashboards.updateField);
  app.put('/REST/dashboards/:id', dashboards.update);
  
  var indicateurs = require('./controllers/api/indicateurs');
  app.get('/REST/indicateurs', indicateurs.find);
  app.get('/REST/indicateurs/:id', indicateurs.find);
  app.post('/REST/indicateurs', indicateurs.add);
  app.post('/REST/indicateurs/:id', indicateurs.updateField);
  app.put('/REST/indicateurs/:id', indicateurs.update);

  var taches = require('./controllers/api/taches');
  app.get('/REST/taches', taches.find);
  app.get('/REST/taches/:id', taches.find);
  app.post('/REST/taches', taches.add);
  app.put('/REST/taches/:id', taches.update);
  app.delete('/REST/taches/:id', taches.delete);

  var mesures = require('./controllers/api/mesures');
  app.get('/REST/mesures', mesures.findAll);
  app.get('/REST/mesures/byTask/:idC/:idA', mesures.findByTask);
  app.get('/REST/mesures/byIndicateur/:idC/:idA', mesures.findByIndicateur);
  app.post('/REST/mesures', mesures.add);
  app.put('/REST/mesures/:id', mesures.update);

  var activities = require('./controllers/api/activities');
  app.get('/REST/activities', activities.findAll);
  app.get('/REST/activities/treeview', activities.findAllTreeview);
  app.post('/REST/activities', activities.addactivity);

  var axes = require('./controllers/api/axes');
  app.get('/REST/axes', axes.findAll);
  app.post('/REST/axes', axes.addaxe);

  var contextes = require('./controllers/api/contextes');
  app.get('/REST/contextes', contextes.findAll);
  app.post('/REST/contextes', contextes.addcontexte);


  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All undefined api routes should return a 404
  app.get('/REST/*', function(req, res) {
    res.send(404);
  });
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};