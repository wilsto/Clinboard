
console.log(" Loading Database ");
console.log("-------------------");

var Datastore = require('nedb');

dbIndicateurs = new Datastore({ filename: 'data/indicateurs.nedb', autoload: true });
dbIndicateurs.loadDatabase();
console.log("+Indicateurs");

dbTaches = new Datastore({ filename: 'data/Taches.nedb', autoload: true });
dbTaches.loadDatabase();
console.log("+Taches");

dbMesures = new Datastore({ filename: 'data/Mesures.nedb', autoload: true });
dbMesures.loadDatabase();
console.log("+Mesures");

dbActivities = new Datastore({ filename: 'data/activities.nedb', autoload: true });
dbActivities.loadDatabase();
console.log("+Activities");

dbContextes = new Datastore({ filename: 'data/Contextes.nedb', autoload: true });
dbContextes.loadDatabase();
console.log("+Contextes");

dbAxes = new Datastore({ filename: 'data/Axes.nedb', autoload: true });
dbAxes.loadDatabase();
console.log("+Axes");

console.log("-------------------");

