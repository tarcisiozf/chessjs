var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
	res.end();
}

io.on('connection', function (socket) {

	var room_id;

	socket.on('movePiece', function (data) {
		socket.broadcast.to(room_id).emit('movePiece', data);
	});

	socket.on('attackPiece', function (data) {
		socket.broadcast.to(room_id).emit('attackPiece', data);
	});

	socket.on('setPlayer', function (data) {
		socket.broadcast.to(room_id).emit('setPlayer', data);
	});

	socket.on('join_room', function(data) {
		room_id = data.room_id;
		socket.join(data.room_id);
	});

});

/*setInterval(function() { 
	io.in(1).emit('msg', 'teste');
}, 3000);*/