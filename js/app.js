(function($) {

	var socket = io.connect('http://localhost:1337');

	var titles = [];
	var cours = [];
	socket.on('init', function(data) {
		titles = data.titles;
		cours = data.cours;
		var str = '<td></td>'
		cours.forEach(function (elem, index) {
			str += '<th scope="col">'+index+'</th>';
		});
		$('#trade').find('thead').append(str);
		titles.forEach(function (elem, index) {
			str = '<th scope="row">'+elem+'</th>';
			cours.forEach(function (elem) {
				str += '<td>'+elem[index]+'</td>';
			});
			$('#trade').find('tbody').append(str);
		});
		chart = $('#trade').visualize({type: 'area', height: 500});
	});

})(jQuery);