#!/usr/bin/nodejs

var server = require('http').createServer();
var io = require('socket.io')(server);

/*
** Here are to usefull variables
*/

var startCapital, currentCapital, currentDay, totalDay;
var titles, cours = [];
var debug = '';

/*
** Create the server
*/

server.listen(1337, function() {
	io.sockets.emit('debug', 'Server listening on port '+server.address.port);
	/* Start the process here */
	//process_throught_file();
});

/* Do something on client connection */
io.on('connection', function(socket) {
	io.sockets.emit('debug', 'Successfully connected.');
	console.log("New User : Broadcasting !");

	socket.on('init', function(obj) {
		console.log("init :", obj);
		startCapital = obj.startCapital;
		currentCapital = obj.currentCapital;
		currentDay = obj.currentDay;
		totalDay = obj.totalDay;
		titles = obj.titles;
		io.sockets.emit('init', obj);
	})

	socket.on('new_value', function(data) {
		console.log("data received :", data);
		io.sockets.emit('new_value', data);
	})

	socket.on('debug', function(data) {
		console.log("debug received :", data);
		io.sockets.emit('debug', data);
	})

});