#!/usr/bin/nodejs

var fs = require('fs');
var rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

var startCapital = parseInt(process.argv[2]);
var currentCapital = startCapital;
var totalDay = parseInt(process.argv[3]);
var titles = [];
var cours = [];
var currentDay = 0;
var serverOnline = true;

if (serverOnline) {
	var io = require('socket.io/node_modules/socket.io-client');
	var client = io('http://localhost:1337');
}


function getCours(days) {
	return cours[cours.length-1-days];
}

function getAverage(cours_index) {
	var avg = 0.0;
	var count = 0;
	cours.forEach(function (obj) {
		avg += obj["real-"+cours_index];
		++count;
	});
	return getCours(0)["real-"+cours_index] / (avg / count);
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
			obj[k] += tmp["avg-"+k];
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
			obj[k] += tmp["avg-"+k] * nbDays - i + 1;
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

	for (var k in titles) {
		obj["avg-"+k] = getAverage(k);
	}
	
	if (serverOnline)
		client.emit('new_value', obj);
	var debug = "["+currentDay+"]";
	for (var k in titles) {
		debug += " {"+titles[k]+": "+obj["real-"+k]+"}";
	};
	console.log(debug);
}


process_throught_file = function() {

	rl.resume();

	rl.on('line', function (cmd) {

		var line = cmd.split(';');
		if (currentDay == 0) {
			titles = line;
			if (serverOnline)
				client.emit('init', {titles: titles, startCapital: startCapital, currentCapital: currentCapital, totalDay: totalDay, currentDay: currentDay});
		} else {
			var obj = {	};

			line.forEach(function (elem, index, array) {
				obj["real-"+index] = parseFloat(elem.replace(',','.').replace(' ',''));
			});
			cours.push(obj);

			handle_new_value();
		}
		++currentDay;
	});

}

/* Start ! */
rl.pause();
if (serverOnline) {
	client.on('connect', function() {
		serverOnline = true;
		process_throught_file();
	});
	client.on('error', function() {
		serverOnline = false;
		client.close();
		process_throught_file();
	});
	client.on('connect_error', function() {
		serverOnline = false;
		client.close();
		process_throught_file();
	});
}