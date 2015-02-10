#!/usr/bin/nodejs

var fs = require('fs');
var rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

var io = require('socket.io/node_modules/socket.io-client');

client = io.connect('http://'+'localhost'+':'+1337);

var startCapital = parseInt(process.argv[2]);
var currentCapital = startCapital;
var totalDay = parseInt(process.argv[3]);
var titles = [];
var cours = [];
var currentDay = 0;


function getCours(days) {
	return cours[cours.length-1-days];
}

calcSMA = function(nbDays) {
	// Simple Mobile Average == Long Terme
	var i = nbDays;
	var obj = {};
	for (var k in titles) {
		obj[k] = 0.0;
	}
	while (i > 0) {
		var tmp = getCours(i);
		for (var k in titles) {
			obj[k] += tmp[k];
		}
		i--;
	}
	for (var k in titles) {
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
	for (var k in titles) {
		obj[k] = 0.0;
	}
	while (i > 0) {
		var tmp = getCours(i);
		for (var k in titles) {
			obj[k] += tmp[k] * nbDays - i + 1;
		}
		coeff += nbDays - i + 1;
		i--;
	}
	for (var k in titles) {
		obj[k] /= coeff;
	}
	console.log("WMA : ", obj);
	return obj;
}

handle_new_value = function() {
	var obj = getCours(0);
	var debug = "["+currentDay+"]";
	for (var k in titles) {
		debug += " {"+titles[k]+": "+obj[k]+"}";
	};
	console.log(debug);
	if (currentDay > 20) {
		calcSMA(5);
		calcWMA(5);
	}
}


rl.pause();

process_throught_file = function() {

	rl.resume();


	rl.on('line', function (cmd) {

		var line = cmd.split(';');
		if (currentDay == 0) {
			titles = line;
			client.emit('init', {titles: titles, startCapital: startCapital, currentCapital: currentCapital, totalDay: totalDay, currentDay: currentDay});
		} else {
			var obj = {	};

			line.forEach(function (elem, index, array) { obj[index] = parseFloat(elem.replace(',','.').replace(' ','')); });
			//client.sockets.emit('new_value', {value: obj});
			cours.push(obj);

			/*  */

			handle_new_value();
		}
		++currentDay;
	});

}

client.on('connect',function() {
	process_throught_file();
}); 
