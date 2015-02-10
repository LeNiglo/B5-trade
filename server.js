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
io.on('connection', function() {
	console.log("New User : Broadcasting !");
	io.sockets.emit('init', {startCapital: startCapital, currentCapital: currentCapital, titles: titles, cours: cours});
});

io.on('init', function(obj) {
	startCapital = obj.startCapital;
	currentCapital = obj.currentCapital;
	currentDay = obj.currentDay;
	totalDay = obj.totalDay;
	titles = obj.titles;
	server.emit(obj);
})

io.on('new_value', function(data) {
	console.log("data received :", data);
})
