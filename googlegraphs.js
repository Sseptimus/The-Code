console.log("loading chart")

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
    var data = google.visualization.arrayToDataTable([
    ['State', 'Number of people'],
    ['dead', 8],
    ['alive', 2],
    ['sick', 2],

  ]);

    var options = {'title':'Population', 'width':550, 'height':400};

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(data, options);
  }