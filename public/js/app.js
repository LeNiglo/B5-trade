(function($) {

	var socket = io.connect('http://localhost:1337');

	var titles = [];
	var cours = [];
	socket.on('init', function(data) {
		console.log(data);
		titles = data.titles;
		cours = data.cours;
		$('#current_capital').text(data.capital);
		$('#start_capital').text(data.start_capital);
		var str = '<td></td>'
		cours.forEach(function (elem, index) {
			str += '<th scope="col">'+index+'</th>';
		});
		$('#trade').find('thead').append(str);
		titles.forEach(function (elem, index) {
			var li = '<li>'+elem+'</li>'; 
			$("#much-titles").append(li);
			
			str = '<th scope="row">'+elem+'</th>';
			cours.forEach(function (elem) {
				str += '<td>'+elem[index]+'</td>';
			});
			$('#trade').find('tbody').append(str);
			
		});
		chart = $('#trade').visualize({type: 'area', height: 500});
	});

	socket.on('debug', function(data) {
		$('#debug').append(data+'<br />');
	});

})(jQuery);