// $(function() {
//   $('#containerCharts').highcharts({
//     chart: {
//       zoomType: 'xy'
//     },
//     title: {
//       text: ''
//     },
//     legend: {
//       enabled: false
//     },
//     xAxis: [{
//         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//         ],
//         plotBands: [{
//             from: -0.5,
//             to: 4.5,
//             color: 'rgba(193,62,68, .2)'
//           }, {
//             from: 8.5,
//             to: 10.5,
//             color: 'rgba(193,62,68, .2)'
//           }
//         ]
//       }
//     ],
//     yAxis: [{
//         labels: {
//           format: '{value}',
//           style: {
//             color: '#808080'
//           }
//         },
//         title: {
//           text: 'Valeur',
//           style: {
//             color: '#808080'
//           }
//         }
//       }
//     ],
//     tooltip: {
//       shared: true
//     },
//     series: [{
//         name: 'Valeur',
//         color: '#808080',
//         type: 'spline',
//         data: [7.0, {
//             y: 6.9,
//             marker: {
//               symbol: 'url(../images/exclamation-icon.png)'
//             }
//           },
//           9.5, 14.5, 18.2, 28.5, 35.2, 26.5, 38.3, 18.3, {
//             y: 13.9,
//             marker: {
//               symbol: 'url(../images/exclamation-icon.png)'
//             }
//           },
//           21.6
//         ],
//         tooltip: {
//           valueSuffix: ''
//         }
//       }
//     ]
//   });

// });
function displayIndicateurs(filter) {
  $(".divcount").removeClass('selected');
  $("#divcount" + filter).addClass('selected');
  $("#count" + filter).css('color', '#ffffff');
  //console.log(grid.columns);
  /*if (filter=="alert") {
    grid.columns[6].visible = false;
  }*/
  loadData();
}

$(function(){

 
    function incrementValue(e){
        var valueElementid = e.currentTarget.id.replace('minus','').replace('plus','');
        var valueElement = $('#'+valueElementid+"zoom"); 
        valueElement.text(Math.max(parseInt(valueElement.text()) + e.data.increment, 0));
        loadData();
        return false;
    }

    $('#axeplus').bind('click', {increment: 1}, incrementValue);
    $('#axeminus').bind('click', {increment: -1}, incrementValue);

    $('#activityplus').bind('click', {increment: 1}, incrementValue);
    $('#activityminus').bind('click', {increment: -1}, incrementValue);

    $('#contexteplus').bind('click', {increment: 1}, incrementValue);
    $('#contexteminus').bind('click', {increment: -1}, incrementValue);

});
