var chart = null;
var titles = [];
var cours = [];
var day = 1;

(function($) {

	var socket = io.connect('http://localhost:1337');

	socket.on('init', function(data) {
		console.log("init :", data);
		titles = data.titles;
		cours = data.cours;
		$('#currentCapital').text(data.currentCapital);
		$('#startCapital').text(data.startCapital);
		var str = '<td></td>'
		
		if (titles) {
			titles.forEach(function (elem, index) {
				$("#trade").find('tbody').append('<tr id="tr-'+index+'"><th scope="row">'+elem+'</th></tr>');
				$("#muchTitles").append('<li>' + elem + '</li>')
			});
			$("#trade").find('thead').append("<tr><td></td></tr>");

			chart = $('#trade').visualize({type: 'line', height: 500, width: 800, appendTitle: false, topValue: 200, bottomValue: 0});

			cours.forEach(function (elem, index) {
				new_value(elem);
			});
			refresh();
		}
	});

	socket.on('debug', function(data) {
		$('#debug').append(data+'<br />');
	});

	socket.on('new_value', function(data) {
		//console.log("new value :", data);
		console.log(day);

		new_value(data);
	})

})(jQuery);

var refresh = function() {
	if (chart) {
		chart.trigger('visualizeRefresh');
		console.log("refreshed");
	}
}

setInterval(refresh(), 2000);

function new_value(data) {
	$('#trade').find('thead tr').append('<th scope="col">'+day+'</th>');
	titles.forEach(function (elem, index) {
		$("#trade").find('tbody #tr-'+index).append('<td>'+ (data["avg-"+ index] * 100) +'</td>');
	});
	day++;
}