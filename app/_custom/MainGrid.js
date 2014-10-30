var dataView;
var grid;
var data = [];

// déclaration des tableaux de valeurs
var someActivities = [];
var someAxes    = [];
var someContextes = [];
var someType =["Alerte", "Objectif", "Anticipation", "Information"];

// déclaration des variables de filtres
var entrylevelActivityString = '';
var searchActivityString = '' ;
var entrylevelAxeString ='';
var searchAxeString = '';
var entrylevelContexteString = '';
var searchContexteString = '';
var searchTypeString = '';
var nActivity = 1;
var nAxe = 1;
var nContexte = 1;

var columns = [
{ id: "type", name: "type", field: "type", cssClass: "cell-selection", width: 40, resizable: false, sortable: false, focusable: true, formatter: Slick.Formatters.TypeIndicFormatter},
{ id: "activitycol", name: "Activity", field: "activitycol", width: 100, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
{ id: "contextecol", name: "Contexte", field: "contextecol", width: 100, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
{ id: "axecol", name: "Axe", field: "axecol", cssClass: "cell-mesure", width: 100, minWidth: 50,  sortable: true, editor: Slick.Editors.Text},

//{id: "activity", name: "activity", field: "activity", width: 150, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
//{id: "axe", name: "axe", field: "axe", width: 150, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
//{id: "contexte", name: "contexte", field: "contexte", width: 150, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
{ id: "indicateur", name: "Indicateur", field: "indicateur", width: 200, minWidth: 50, cssClass: "cell-mesure", sortable: true, editor: Slick.Editors.Text},
{ id: "mesure", name: "Mesure", field: "mesure", width: 50, minWidth: 50, cssClass: "cell-mesure", sortable: false, editor: Slick.Editors.Text},
{ id: "mesureval", name: "Valeur", field: "mesureval", width: 50, minWidth: 50, cssClass: "cell-mesure", sortable: false, editor: Slick.Editors.Text}, 
{ id: "alerte", name: "Alerte", field: "alerte", width: 50, sortable: false, formatter: Slick.Formatters.AlerteFormatter, groupTotalsFormatter: sumTotalsAlerteFormatter},
//{id: "alertehist", name: " ", field: "alertehist", width: 50, sortable: true, formatter: waitingFormatter, rerenderOnResize: false, asyncPostRender: renderSparklineBar},
{ id: "%", name: "% Objectif", field: "percentObjectif", width: 70,  sortable: false, formatter: Slick.Formatters.PercentCompleteBar, groupTotalsFormatter: avgTotalsFormatter},
//{id: "percentObjectifhist", name: " ", field: "percentObjectifhist", width: 100, sortable: true, formatter: waitingFormatter, rerenderOnResize: true, asyncPostRender: renderSparkline},
{ id: "anticipation", name: "anticipation", field: "anticipation", width: 70, sortable: false},
//{id: "anticipationhist", name: " ", field: "anticipationhist", width: 100, sortable: true, formatter: waitingFormatter, rerenderOnResize: true, asyncPostRender: renderSparkline},
//{id: "communication",   name: "Communication",  field: "communication",   width: 110,   sortable: false,   groupTotalsFormatter: sumTotalsFormatter},
//{id: "refval", name: "Référence", field: "refval", width: 50,  minWidth: 50, cssClass: "cell-mesure", sortable: false, editor: Slick.Editors.Text },
//{id: "ageval", name: "Age", field: "ageval", width: 50, minWidth: 50, cssClass: "cell-mesure", sortable: false, editor: Slick.Editors.Text},
{id: "confianceval", name: "Confiance", field: "Confiance", width: 70, formatter: Slick.Formatters.PercentCompleteBar, sortable: false},
//{id: "action", name: "Action", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-action", field: "effortDriven", formatter: Slick.Formatters.Checkmark, sortable: false}
 ];
 var columnsWithHighlightingById = {};

 for (var i = 1; i < 4; i++) {
  columns[i].header = {
   buttons: [
   {
   cssClass: "icon-highlight-on",
   command: "toggle-highlight",
   tooltip: "Highlight negative numbers."
  }
  ],
  menu: {
   items: [
   {
    iconImage: "../images/sort-asc.gif",
    title: "Sort Ascending",
    command: "sort-asc"
   },
   {
    iconImage: "../images/sort-desc.gif",
    title: "Sort Descending",
    command: "sort-desc"
   },
   {
    title: "Hide Column",
    command: "hide",
    disabled: true,
    tooltip: "Can't hide this column"
   },
   {
    iconCssClass: "icon-help",
    title: "Help",
    command: "help"
   }
   ]
  }
 };
}

var options = {
 enableCellNavigation: true,
 editable: false,
 forceFitColumns: true,
 enableAsyncPostRender: false,
 autoHeight:true
};

var sortcol           = "mesure";
var sortdir           = 1;
var percentObjectifThreshold   = 0;
var prevpercentObjectifThreshold = 0;

var sort_and_unique = function(origArr) {
 origArr.sort();
  var newArr = [],
    origLen = origArr.length,
    found, x, y;

  for (x = 0; x < origLen; x++) {
    found = undefined;
    for (y = 0; y < newArr.length; y++) {
      if (origArr[x] === newArr[y]) {
        found = true;
        break;
      }
    }
    if (!found) {
      newArr.push(origArr[x]);
    }
  }
  return newArr;
}


function setupFilter() {
 searchtxt = visualSearch.searchQuery.facets();
 for (i = 0; i < searchtxt.length; i++) {
  for(var key in searchtxt[i]) {
   var val = searchtxt[i][key];
   if (key == "Activity") {
    entrylevelActivityString = val;
    searchActivityString = val + "*";
   }
   if (key == "Axe") {
    entrylevelAxeString =val;
    searchAxeString = val + "*";
   }
   if (key == "Contexte") {
    entrylevelContexteString = val;
    searchContexteString = val + "*";

   }
   if (key == "Type") {
    searchTypeString = val ;
   }
  }
 }

 nActivity = $('#activityzoom').html();
 nAxe = $('#axezoom').html();
 nContexte = $('#contextezoom').html();


 dataView.setFilterArgs({
 searchAxeString: searchAxeString,
 searchContexteString: searchContexteString,
 searchActivityString: searchActivityString,
 searchTypeString: searchTypeString
 });
}

function loadData() {

 setupFilter();
 //dataView.setFilter(myFilter);
 //groupByAxeContexteActivity();

 data = [];
 $.getJSON('/data/ClinBoard.json', function(data) {
    // prepare the data
    for (var i = 0; i < data.length; i++) {
     var d = data[i];
     // d["id"] = "id_" + i;
     //d["type"] = Math.round(Math.random() * 3);

     // d["activitycol"]   = someActivities[Math.floor((Math.random() * 20))];
     // d["axecol"]     = someAxes[Math.floor((Math.random() * 13))];
     // d["contextecol"]   = someContextes[Math.floor((Math.random() * 18))];
     /* valeurs modifiées pour affichage par groupe selon restriction */
     var str       = d["activitycol"];
     var pos       = nth_occurrence(str.substring(entrylevelActivityString.length + 1), '.', nActivity);
     pos         == 0 ? Correctif = 0 : Correctif = 1;
     d["activity"]    = (pos < 0 || pos === false) ? d["activitycol"] : d["activitycol"].substring(0, entrylevelActivityString.length + Correctif + pos);
     someActivities.push(d["activitycol"]);

     /* valeurs modifiées pour affichage par groupe selon restriction */
     var str       = d["axecol"];
     var pos       = nth_occurrence(str.substring(entrylevelAxeString.length + 1), '.', nAxe);
     d["axe"]       = (pos < 0 || pos === false) ? d["axecol"] : d["axecol"].substring(0, entrylevelAxeString.length + 1 + pos); 
     someAxes.push(d["axecol"]);
     /* valeurs modifiées pour affichage par groupe selon restriction */
     var str       = d["contextecol"];
     var pos       = nth_occurrence(str.substring(entrylevelContexteString.length + 1), '.', nContexte);
     d["contexte"]    = (pos < 0 || pos === false) ? d["contextecol"] : d["contextecol"].substring(0, entrylevelContexteString.length + pos + 1);
     someContextes.push(d["contextecol"]);
     // d["indicateur"]   = "n°" + Math.round(Math.random() * 5);
     // d["mesure"]     = "Mesure indicateur " + i;
     // d["mesureval"]    = Math.round(Math.random() * 1000);
     // d["ageval"]     = Math.round(Math.random() * 90);
     // d["alerte"]     = (Math.round(Math.random() * 100) < 10 ? (Math.round(Math.random() * 1)) : "");
     // d["percentObjectif"] = (Math.round(Math.random() * 100) < 40 ? (Math.round(Math.random() * 100)) : "");
     // d["anticipation"]  = (Math.round(Math.random() * 100) < 20 ? (Math.round(Math.random() * 100)) : "");
     // d["communication"]  = (Math.round(Math.random() * 100) < 20 ? (Math.round(Math.random() * 100)) : "");
     /* mise à jour de la première colonne */
     if (d["communication"] > 0) {
      d["type"] = 3;
     }
     if (d["anticipation"] > 0) {
      d["type"] = 2;
     }
     if (d["percentObjectif"] > 0) {
      d["type"] = 1;
     }
     if (d["alerte"] > 0) {
      d["type"] = 0;
     }
     d["effortDriven"] = (i % 5 === 0);
     // console.log(data[i]);
    }

    //supprimer les doublons du tableau
    someActivities = sort_and_unique(someActivities);
    someAxes = sort_and_unique(someAxes);
    someContextes = sort_and_unique(someContextes);

    //afficher les donnés
    dataView.setItems(data);
   });
}

function toggleFilterRow() {
 grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
}

function avgTotalsFormatter(totals, columnDef) {
 var value = totals.avg && totals.avg[columnDef.field];
 if (value !== null) {

  var color;

  if (value < 80) {
   color = "silver";
  } else {
   color = "green";
  }
  var trendval = Math.round(Math.random() * 2);
  if (trendval === 0) {
   trend = "<img src='../images/arrow_mini_right.png'>";
  }
  if (trendval == 1) {
   trend = "<img src='../images/arrow_mini_down.png'>";
  }
  if (trendval == 2) {
   trend = "<img src='../images/arrow_mini_up.png'>";
  }

  return "<span class='percent-complete-bar' style='background:" + color + ";width:" + (value / 2) + "%'></span> " + Math.round(value) + "% <span style='float:right;text-align:right;'>" + trend + "</span>";
 }
}

function sumTotalsFormatter(totals, columnDef) {
 var val = totals.sum && totals.sum[columnDef.field];
 if (val !== null) {
  return "total: " + ((Math.round(parseFloat(val) * 100) / 100));
 }
 return "";
}

function sumTotalsAlerteFormatter(totals, columnDef) {
 var val = totals.sum && totals.sum[columnDef.field];
 if (val !== null) {

  if (val >= 1) {
   return "<center><img src='../images/dot_red.gif'> " + val + "</center>";
  } else {
   return "<center><img src='../images/dot_green.gif'> " + totals.group.count + "</center>";
  }
 }
}

function myFilter(item, args) {
 return item["percentObjectif"] >= args.percentObjectif;
}

function percentObjectifSort(a, b) {
 return a["percentObjectif"] - b["percentObjectif"];
}

function comparer(a, b) {
 var x = a[sortcol],
 y = b[sortcol];
 return (x == y ? 0 : (x > y ? 1 : -1));
}

function groupByAxeContexteActivity() {

 var ListColumns = grid.getColumns();

 var blngroup = [];
 var group = [];
 var grid_aggregators = [];

 blngroup[1] = (ListColumns[1].header.buttons[0].cssClass = "icon-highlight-off") ? false:true;
 blngroup[2] = (ListColumns[2].header.buttons[0].cssClass = "icon-highlight-off") ? false:true;
 blngroup[3] = (ListColumns[3].header.buttons[0].cssClass = "icon-highlight-off") ? false:true;

 group[1] = ListColumns[1].name;
 group[2] = ListColumns[2].name;
 group[3] = ListColumns[3].name;

 /* for (i = 0; i < 4; i++) {
   if (str.charAt(i) == needle) {
    if (!--nth) {
     return i;
    }
   }
  }*/



  dataView.setGrouping([{
   getter: group[1].toLowerCase(),
   formatter: function(g) {
    return "<span style='color:green;font-weight: bold;'> " + group[1] + " :  </span>" + g.value + " <span style='color:grey'>(" + g.count + ")</span>";
   },
   aggregators: [
    /*new Slick.Data.Aggregators.Sum("alerte"),
    new Slick.Data.Aggregators.Avg("percentObjectif"),
    new Slick.Data.Aggregators.Avg("anticipation"),
    new Slick.Data.Aggregators.Sum("communication")*/
    ],
    aggregateCollapsed: true
   }, {
    getter: group[2].toLowerCase(),
    formatter: function(g) {
     return "<span style='color:red;font-weight: bold;'> " + group[2] + " :  </span>" + g.value + " </span> <span style='color:grey'>(" + g.count + ")</span>";
    },
    aggregators: [
    /*new Slick.Data.Aggregators.Sum("alerte"),
    new Slick.Data.Aggregators.Avg("percentObjectif"),
    new Slick.Data.Aggregators.Avg("anticipation"),
    new Slick.Data.Aggregators.Sum("communication")*/
    ]
   }, {
    getter: group[3].toLowerCase(),
    formatter: function(g) {
     return "<span style='color:blue;font-weight: bold;'> " + group[3] + " : </span>" + (g.value) + " </span> <span style='color:grey'>(" + g.count + ")</span>";
    },
    aggregators: [
    new Slick.Data.Aggregators.Sum("alerte"),
    new Slick.Data.Aggregators.Avg("percentObjectif"),
    new Slick.Data.Aggregators.Avg("anticipation")
    /*,
    new Slick.Data.Aggregators.Sum("communication")*/
    ],
    aggregateCollapsed: true,
    collapsed: true
   }, {
    getter: "indicateur",
    formatter: function(g) {
     return "<span style='color:black;font-weight: bold;'> Indicateur:  </span>" + (g.value) + " </span> <span style='color:grey'>(" + g.count + ")</span>";
    },
    aggregators: [
    new Slick.Data.Aggregators.Sum("alerte"),
    new Slick.Data.Aggregators.Avg("percentObjectif"),
    new Slick.Data.Aggregators.Avg("anticipation")
    /*,
    new Slick.Data.Aggregators.Sum("communication")*/
    ],
    aggregateCollapsed: true,
    collapsed: true
   }
   ]);
}

function nth_occurrence(str, needle, nth) {
 if (nth === 0) {
  return 0;
 }
 for (i = 0; i < str.length; i++) {
  if (str.charAt(i) == needle) {
   if (!--nth) {
    return i;
   }
  }
 }
 return str.length;
}

function updateRowsCount() {
 var countalerte = 0;
 var countanticipation =0;
 var countinformation =0;
 var arrayobjectif =[];

 for (i = 0; i < dataView.getLength(); i++) {
  countalerte = (dataView.getItems()[i].type==0) ? countalerte+1:countalerte;
  countanticipation = (dataView.getItems()[i].type==2) ? countanticipation+1:countanticipation;
  countinformation = (dataView.getItems()[i].type==3) ? countinformation+1:countinformation;
  if (dataView.getItems()[i].percentObjectif !== undefined) arrayobjectif.push(dataView.getItems()[i].percentObjectif);
 }

 
 $("#countall").empty().text(dataView.getLength(0));

 $("#countalerte").empty().text(countalerte);
 $("#countanticipation").empty().text(countanticipation);
 $("#countinformation").empty().text(countinformation);

 avg = "N/A";
 if (arrayobjectif.length) {
  var sum = arrayobjectif.reduce(function(previousValue, currentValue, index, array){return previousValue + currentValue;});
  var avg = sum/arrayobjectif.length;
 }
 $("#countobjectif").empty().text(avg);

}

/* Start of sparline scripts */

function waitingFormatter(value) {
 return "wait...";
}

function renderSparklineBar(cellNode, row, dataContext, colDef) {
 var vals = [
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2))
 ];
 typeof dataContext.sum == 'undefined' ? value = dataContext.alerte : value = dataContext.sum["alerte"];
 if (colDef.id == "alerthist" && value > 0) {
  $(cellNode).empty().sparkline(vals, {
   width: "100%",
   type: 'bar',
   height: '10',
   barColor: '#c66565',
   zeroColor: 'green'
  });
 }
}

function renderSparkline(cellNode, row, dataContext, colDef) {
 var vals = [
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2)),
 Math.floor((Math.random() * 2))
 ];
 if (typeof dataContext.avg == 'undefined') {
  value = dataContext.percentObjectif;
  value2 = dataContext.anticipation;
 } else {
  value = dataContext.avg["percentObjectif"];
  value2 = dataContext.avg["anticipation"];
 }

 if (colDef.id == "percentObjectifhist" && value.length > 0) {
  $(cellNode).empty().sparkline(vals, {
   width: "100%"
  });
 }

 if (colDef.id =="anticipationhist" && value2.length > 0) {
  $(cellNode).empty().sparkline(vals, {
   width: "100%"
  });
 }

}
/* End of sparline scripts */

$(function() {
 var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
 dataView = new Slick.Data.DataView({
  groupItemMetadataProvider: groupItemMetadataProvider,
  inlineFilters: true
 });
 grid = new Slick.Grid("#myGrid", dataView, columns, options);

 // register the group item metadata provider to add expand/collapse group handlers
 grid.registerPlugin(groupItemMetadataProvider);
 grid.setSelectionModel(new Slick.CellSelectionModel());

 var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
 var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);

 grid.onSort.subscribe(function(e, args) {
  sortdir = args.sortAsc ? 1 : -1;
  sortcol = args.sortCol.field;

  if ($.browser.msie && $.browser.version <= 8) {
   // using temporary Object.prototype.toString override
   // more limited and does lexicographic sort only by default, but can be much faster

   var percentObjectifValueFn = function() {
    var val = this["percentObjectif"];
    if (val < 10) {
     return "00" + val;
    } else if (val < 100) {
     return "0" + val;
    } else {
     return val;
    }
   };

   // use numeric sort of % and lexicographic for everything else
   dataView.fastSort((sortcol == "percentObjectif") ? percentObjectifValueFn : sortcol, args.sortAsc);
  } else {
   // using native sort with comparer
   // preferred method but can be very slow in IE with huge datasets
   dataView.sort(comparer, args.sortAsc);
  }
 });

 // wire up model events to drive the grid
 dataView.onRowCountChanged.subscribe(function(e, args) {
  grid.updateRowCount();
  grid.render();
 });

 dataView.onRowsChanged.subscribe(function(e, args) {
  grid.invalidateRows(args.rows);
  grid.render();

  // mise à jour des nombres totaux dans le panel de gauche
  updateRowsCount();
 });



 /* Start of headermenu scripts */
 /*******************************/
 var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

 headerMenuPlugin.onBeforeMenuShow.subscribe(function(e, args) {
  var menu = args.menu;

   // We can add or modify the menu here, or cancel it by returning false.
   var i = menu.items.length;
   menu.items.push({
    title: "Menu item " + i,
    command: "item" + i
   });
  });

 headerMenuPlugin.onCommand.subscribe(function(e, args) {
   //alert("Command: " + args.command);
  });

 grid.registerPlugin(headerMenuPlugin);
 /*******************************/
 /* End of headermenu scripts */


 /* Start of headerbutton scripts */
 /*******************************/
 var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();

 headerButtonsPlugin.onCommand.subscribe(function(e, args) {
  var column = args.column;
  var button = args.button;
  var command = args.command;

  if (command == "toggle-highlight") {
   if (button.cssClass == "icon-highlight-on") {
    delete columnsWithHighlightingById[column.id];
    button.cssClass = "icon-highlight-off";
    button.tooltip = "Highlight negative numbers."
   } else {
    columnsWithHighlightingById[column.id] = true;
    button.cssClass = "icon-highlight-on";
    button.tooltip = "Remove highlight."
   }

   grid.invalidate();
  }
 });



/* Permet de filtrer les différents groupes suivant les informations du tag filter */
 function myFilter(item, args) {
  searchActivity = args.searchActivityString.replace(/\*/g, "[a-zA-Z0-9]*").replace(/\./g, "\\.");
  
  if (args.searchActivityString !== "" && item["activity"].match(searchActivity) === null) {
   return false;
  }

  searchAxe = args.searchAxeString.replace(/\*/g, "[a-zA-Z0-9]*").replace(/\./g, "\\.");
  //console.log(searchAxe + '  ' + args.searchAxeString + '  ' + item["Axe"] + '  ' + item["Axe"].match(searchAxe));
  if (args.searchAxeString !== "" && item["axe"].match(searchAxe) === null) {
   return false;
  }

  searchContexte = args.searchContexteString.replace(/\*/g, "[a-zA-Z0-9]*").replace(/\./g, "\\.");
  if (args.searchContexteString !== "" && item["contexte"].match(searchContexte) === null) {
   return false;
  }

  if (args.searchTypeString.length > 0 ) {
  searchTypeString = someType.indexOf(args.searchTypeString);
  if (args.searchTypeString !== "" && item["type"] !== searchTypeString) {
   return false;
  }
 }
  return true;
 }

 function filterAndUpdate() {
  var isNarrowing = percentObjectifThreshold > prevpercentObjectifThreshold;
  var isExpanding = percentObjectifThreshold < prevpercentObjectifThreshold;
  var renderedRange = grid.getRenderedRange();

  dataView.setFilterArgs({
   percentObjectif: percentObjectifThreshold
  });
  dataView.setRefreshHints({
   ignoreDiffsBefore: renderedRange.top,
   ignoreDiffsAfter: renderedRange.bottom + 1,
   isFilterNarrowing: isNarrowing,
   isFilterExpanding: isExpanding
  });
  dataView.refresh();

  prevpercentObjectifThreshold = percentObjectifThreshold;
 }


 grid.registerPlugin(headerButtonsPlugin);
 /*******************************/
 /* End of headerbutton scripts */

 // initialize the model after all the events have been hooked up
 dataView.beginUpdate();

 loadData();

 dataView.setFilterArgs({
  searchAxeString: searchAxeString,
  searchContexteString: searchContexteString,
  searchActivityString: searchActivityString,
  searchTypeString: searchTypeString
 });

 dataView.setFilter(myFilter);
 //groupByAxeContexteActivity();
 dataView.endUpdate();

 $("#gridContainer").resizable();

 // mise à jour des nombres totaux dans le panel de gauche
 updateRowsCount();

 // sauvegarde et mis à jour de l'ordre des colonnes
 //grid.setColumns(store.get('gridColumns'));
 grid.onColumnsReordered.subscribe(function (e, args) {    
  //store.set('gridColumns', grid.getColumns());
  //groupByAxeContexteActivity();
 });


});