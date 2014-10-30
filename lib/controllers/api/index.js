
/**
 * Redirection static (Web pages)
 */

exports.index = function(req, res, next){  
  res.redirect('/home');
}

exports.home = function(req, res, next){ 
  res.render('home', { 'nav' : 'home' }); 
};

exports.about = function(req, res, next){ 
  res.render('about', { 'nav' : 'about' }); 
};

exports.dash = function(req, res, next){ 
  res.render('dash', { 'nav' : 'dash' }); 
};

exports.indicateurs = function(req, res, next){ 
  res.render('indicateurs', { 'nav' : 'indicateurs' }); 
};

exports.mesures = function(req, res, next){ 
  res.render('mesures', { 'nav' : 'mesures' }); 
};

exports.configMesures = function(req, res, next){ 
  res.render('configMesures', { 'nav' : 'configMesures' }); 
};

exports.export = function(req, res, next){ 
  res.render('export', { 'nav' : 'export' }); 
};

exports.config = function(req, res, next){ 
  res.render('config', { 'nav' : 'config' }); 
};

