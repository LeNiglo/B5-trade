#!/usr/bin/nodejs

var fs = require('fs');
var rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

var io = require('socket.io/node_modules/socket.io-client');

client = io.connect('http://'+'localhost'+':'+1337);

client.on('connect',function() {


	var start_capital = parseInt(process.argv[2]);
	var capital = start_capital;
	var total_days = parseInt(process.argv[3]);
	var title = [];
	var cours = [];
	var current_day = 0;


	function getCours(days) {
		return cours[cours.length-1-days];
	}

	calcSMA = function(nbDays) {
		// Simple Mobile Average == Long Terme
		var i = nbDays;
		var obj = {};
		for (var k in title) {
			obj[k] = 0.0;
		}
		while (i > 0) {
			var tmp = getCours(i);
			for (var k in title) {
				obj[k] += tmp[k];
			}
			i--;
		}
		for (var k in title) {
			obj[k] /= nbDays;
		}
		console.log("SMA : ", obj);
		return obj;
	}

	calcWMA = function(nbDays) {
		// Weighted Mobile Average == Moyen Terme
		var i = nbDays;
		var coeff = 0;
		var obj = {};
		for (var k in title) {
			obj[k] = 0.0;
		}
		while (i > 0) {
			var tmp = getCours(i);
			for (var k in title) {
				obj[k] += tmp[k] * nbDays - i + 1;
			}
			coeff += nbDays - i + 1;
			i--;
		}
		for (var k in title) {
			obj[k] /= coeff;
		}
		console.log("WMA : ", obj);
		return obj;
	}

	handle_new_value = function() {
		var obj = getCours(0);
		var debug = "["+current_day+"]";
		for (var k in title) {
			debug += " {"+title[k]+": "+obj[k]+"}";
		};
		console.log(debug);
		if (current_day > 20) {
			calcSMA(5);
			calcWMA(5);
		}
	}

	process_throught_file = function() {

		rl.on('line', function (cmd) {
			var line = cmd.split(';');
			if (current_day == 0) {
				title = line;
				console.log('title', title);
			} else {
				var obj = {	};

				line.forEach(function (elem, index, array) { obj[index] = parseFloat(elem.replace(',','.').replace(' ','')); });
				client.sockets.emit('new_value', {value: obj});
				cours.push(obj);

				/*  */

				handle_new_value();
			}
			++current_day;
		});

	}

	process_throught_file();
}); 
