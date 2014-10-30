 $(document).ready(function() {
  window.visualSearch = VS.init({
    container  : $('#search_box_container'),
    query      : '',
    showFacets : true,
    unquotable : '',
    placeholder : "Filtrer vos indicateurs...",
    callbacks  : {
      search : function(query, searchCollection) {
            	// action lorsque la query est executé

              searchtxt = visualSearch.searchQuery.facets();
              searchActivityString ="";
              searchAxeString="";
              searchContexteString="";
              searchTypeString="";

              for (i = 0; i < searchtxt.length; i++) {
                   console.log(searchtxt[i]);
                for(var key in searchtxt[i]) {
                  var val = searchtxt[i][key];
                      if (key == "Activity") {
                         searchActivityString = val + "*";
                         nActivity = 1;
                      }
                      if (key == "Axe") {
                         searchAxeString = val + "*";
                         nAxe = 1;
                      }
                      if (key == "Contexte") {
                         searchContexteString = val + "*";
                         nContexte = 1;
                      }
                      if (key == "Type") {
                         searchTypeString = someType.indexOf(val);
                      }
                    }
                  }
                  loadData();
                  
                  // mise à jour des nombres totaux dans le panel de gauche
                  updateRowsCount();
                },
                valueMatches : function(category, searchTerm, callback) {
                  switch (category) {
                    case 'Activity':
                    callback(someActivities, {
                    preserveOrder: true // Otherwise the selected value is brought to the top
                  });
                    break;
                    case 'Axe':
                    callback(someAxes, {
                    preserveOrder: true // Otherwise the selected value is brought to the top
                  });
                    break;
                    case 'Contexte':
                    callback(someContextes, {
                    preserveOrder: true // Otherwise the selected value is brought to the top
                  });
                    break;
                    case 'Type':
                    callback(someType, {
                    preserveOrder: true // Otherwise the selected value is brought to the top
                  });
                    break;
                  }
                },
                facetMatches : function(callback) {
                  callback([
                    'Activity', 
                    'Axe', 
                    'Contexte',
                    'Type'
                    ]);
                }
              }
            });
});