(function($) {

	var socket = io.connect('http://localhost:1337');

	var titles = [];
	var cours = [];
	socket.on('init', function(data) {
		console.log("init :", data);
		titles = data.titles;
		cours = data.cours;
		$('#currentCapital').text(data.currentCapital);
		$('#startCapital').text(data.startCapital);
		var str = '<td></td>'
		cours.forEach(function (elem, index) {
			str += '<th scope="col">'+index+'</th>';
		});
		$('#trade').find('thead').append(str);
		titles.forEach(function (elem, index) {
			var li = '<li>'+elem+'</li>'; 
			$("#muchTitles").append(li);
			
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

	socket.on('new_value', function(data) {
		console.log("new value :", data);
		$('#debug').append(JSON.stringify(data)+'<br />');
	})

})(jQuery);