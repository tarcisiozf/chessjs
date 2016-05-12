var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
	res.end();
}

io.on('connection', function (socket) {

	socket.on('receive', function (data) {
		console.log(data);
	});

	socket.on('join_room', function(data) {
		socket.join(data.room);
	});

	// setInterval(function() { io.in(1).emit('msg', 'teste'); }, 3000);
});