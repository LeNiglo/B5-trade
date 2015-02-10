#!/usr/bin/nodejs

var server = require('http').createServer();
var io = require('socket.io')(server);

/*
** Here are to usefull variables
*/

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
	io.sockets.emit('init', {start_capital: start_capital, capital: capital, titles: title, cours: cours});
});

io.on('new_value', )
