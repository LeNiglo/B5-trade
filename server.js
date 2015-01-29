#!/usr/bin/nodejs

var server = require('http').createServer();
var fs = require('fs');
var io = require('socket.io')(server);
var rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});


/*
** Here are to usefull variables
*/

var title = [];
var i = 0;
var cours = [];

/* Do something on client connection */
io.on('connection', function() {
	console.log("New User : Broadcasting !");
	io.sockets.emit('init', {titles: title, cours: cours});
});

server.listen(1337, function() {
	/* Start the process here */
	process_throw_file();

});

process_throw_file = function() {

	rl.on('line', function (cmd) {
		var line = cmd.split(';');
		if (i == 0) {
			title = line;
			console.log('title', title);
		} else {
			var obj = {	};

			line.forEach(function (elem, index, array) {
				obj[index] = elem;
				console.log("["+i+"] {"+title[index]+"} "+elem);
			});
			cours.push(obj);
		}
		++i;
	});

}