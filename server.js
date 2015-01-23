#!/usr/bin/nodejs

var server = require('http').createServer();
var fs = require('fs');
var io = require('socket.io')(server);
var rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

/* Do something on client connection */
io.on('connection', function() {
	
});

server.listen(1337, function() {
	/* Start the process here */

	rl.on('line', function (cmd) {
		console.log('You just typed: '+cmd);
	});
});
