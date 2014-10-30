/***
 * Contains basic SlickGrid formatters.
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "AlerteFormatter": AlerteFormatter,
        "TypeIndicFormatter": TypeIndicFormatter,		
		"PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter
      }
    }
  });

  function TypeIndicFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    } else if (value == 0) {
      return "<center><img src='../images/ico_warning.png'></center>";
    } else  if (value == 1) {
      return "<center><img src='../images/Target-20.png'></center>";
	} else  if (value == 2) {
      return "<center><img src='../images/Time_Machine-20.png'></center>";
	} else  if (value == 3) {
      return "<center><img src='../images/ios-note_info_icon.png'></center>";
    }
	}
  
  function AlerteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    } else if (value < 1) {
      return "<center><img src='../images/dot_green.gif'> " +  value + "</center>";
    } else {
      return "<center><img src='../images/dot_red.gif'> " + value + "</center>";
    }
	}
	
	 
  
  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 80) {
      color = "silver";
    } else {
      color = "green";
    }

	var trendval = Math.round(Math.random() * 2);
	if (trendval == 0) { trend = "<img src='../images/arrow_mini_right.png'>";}
	if (trendval == 1) { trend = "<img src='../images/arrow_mini_down.png'>";}
	if (trendval == 2) { trend = "<img src='../images/arrow_mini_up.png'>";}
	
    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + (value /2) + "%'></span> " + Math.round(value) + "% <span style='float:right;text-align:right;'>" + trend + "</span>";
	
	
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='../images/tick.png'>" : "";
  }
})(jQuery);