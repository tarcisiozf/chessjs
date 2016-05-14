
	/*
		TODO:
		path collision
		multiplayer
		checkmate
	*/

	class Chess {

		constructor() {

			// board initial position
			this.board = [
				['rook_1',	'knight_1',	'bishop_1',	'queen_1',	'king_1',	'bishop_1',	'knight_1',	'rook_1'],
				['pawn_1',	'pawn_1',	'pawn_1',	'pawn_1',	'pawn_1',	'pawn_1',	'pawn_1',	'pawn_1'],
				['empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty'	],
				['empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty'	],
				['empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty'	],
				['empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty',	'empty'	],
				['pawn_0',	'pawn_0',	'pawn_0',	'pawn_0',	'pawn_0',	'pawn_0',	'pawn_0',	'pawn_0'],
				['rook_0',	'knight_0',	'bishop_0',	'queen_0',	'king_0',	'bishop_0',	'knight_0',	'rook_0'],
			];

			// this.board[4][4] = 'queen_0';

			this.piecesAttributes = new piecesAttributes;

			// starts with player 'light'
			this.player = 0;

			// starts without any piece selected
			this.selected_piece;

			// BIND METHODS TO THIS SCOPE
			this.renderBoard = this.renderBoard.bind(this);
			this.selectSquare = this.selectSquare.bind(this);
			this.changeTurn = this.changeTurn.bind(this);
			this.checkMove = this.checkMove.bind(this);

			// Draw the table
			this.renderBoard();
		}

		checkMove(x, y) {

			if ( ! this.selected_piece )
				return;

			// check if the player clicked at same square, if true, unselect piece
			if ( this.selected_piece.x == x && this.selected_piece.y == y ) {
				this.selected_piece = null;
				return;
			}

			var destHasPiece = this.destinationHasPiece(x, y);
			var isEnemy = this.isOpponentPiece(x, y);
			var piece = this.piecesAttributes[this.selected_piece.piece]; // Rules of movements, attacks and etc 

			if ( destHasPiece && ! isEnemy ) { // destination is not emptyy

				this.showMessage("That square is already occupied!");
				return;

			} else if ( destHasPiece && isEnemy ) { // destination has an enemy piece

				if ( piece.canAttack(this.selected_piece, x, y) ) {
					this.attackPiece(x, y);
				} else {
					this.showMessage("You can't attack that piece!");
					return;
				}

			} else {

				// Check if movement is valid
				if ( ! piece.canMove(this.selected_piece, x, y) ) {
					this.showMessage("This isn't a valid movement!");
					return;
				}

				// Check if the path is not blocked
				if ( ! piece.canJump && this.pathIsBlocked(x, y) ) {
					this.showMessage("Your path is blocked!");
					return;
				}

				this.movePiece(x, y);
			}

			this.changeTurn();

		}

		pathIsBlocked(x, y) {

			// moving from left to right
			var range_x = _.range(this.selected_piece.x, x+1);
			var range_y = _.range(this.selected_piece.y, y+1);

			// moving from right to left
			if ( ! range_x.length ) 
				range_x = _.range(x, this.selected_piece.x+1);

			if ( ! range_y.length ) 
				range_y = _.range(y, this.selected_piece.y+1);

			console.log(range_x, range_y);

			x = range_x[0] || x;
			y = range_y[0] || y;

			console.log(x, y);

		}

		isOpponentPiece(x, y) {
			var piece;
			var player;

			[piece, player] = this.piecesAttributes.parse(this.board[y][x]) || [];

			if ( this.player != player ) 
				return true;
		}

		destinationHasPiece(x, y) {
			if (this.board[y][x] != 'empty')
				return true;
		}

		showMessage(message, fade = true) {
			document.querySelector('.message').innerHTML = message;
			if (fade)
				setTimeout(() => this.showMessage(''), 3000);
		}

		selectSquare(x, y) {

			// Transform the string into piece and player
			var square = this.board[y][x];
			var piece;
			var player 

			[piece, player] = this.piecesAttributes.parse(square) || [];

			// You can't choose a emptyy square
			if ( square === 'empty' ) 
				return;

			// Check if the player can choose that piece
			if ( player != this.player ) {	
				this.showMessage("You can't choose a opponent piece!");
				return;
			}

			// Save the piece to make the move
			this.selected_piece = { player, piece, x, y };
		}

		movePiece(x, y) {
			var tmp = this.board[y][x];

			this.board[y][x] = `${this.selected_piece.piece}_${this.selected_piece.player}`;
			this.board[this.selected_piece.y][this.selected_piece.x] = tmp;

			this.selected_piece = null;

			this.renderBoard();
		}

		attackPiece(x, y) {
			this.board[y][x] = `${this.selected_piece.piece}_${this.selected_piece.player}`;
			this.board[this.selected_piece.y][this.selected_piece.x] = 'empty';

			this.selected_piece = null;

			this.renderBoard();
		}

		changeTurn() {
			this.player ^= 1;
			this.showMessage(`Now it's ${['Light','Dark'][this.player]} player turn`, false);
		}

		renderBoard() {

			const bg_colors = ['#FFF','#494949'];
			var color = 1;

			var table = document.createElement('table');

			for ( var y in this.board ) {

				var tr = document.createElement('tr');

				for( var x in this.board[y] ) {

					var piece = this.board[y][x];

					var td = document.createElement('td');
						td.setAttribute('onDrop', `onDrop(event, ${x}, ${y})`);
						td.setAttribute('onDragOver', 'allowDrop(event)');
						td.style = `background-color: ${bg_colors[color]};`;

					var img = document.createElement('img');
						img.id = `img_${x}_${y}`;
						img.src = `images/pieces/${piece}.png`;
						img.setAttribute('onDragStart', `onDragStart(event, ${x}, ${y})`);
						img.draggable = 'true';

					td.appendChild(img);

					tr.appendChild(td);

					// toggle square color
					color ^= 1;
				}

				table.appendChild(tr);

				// toggle square color
				color ^= 1;
			}

			var board = document.querySelector('#board');

			// clear the board first
			if (board.childNodes.length > 0) {
				board.removeChild(board.firstChild);
			}

			board.appendChild(table);
		}

	}

	var game = new Chess;

	var allowDrop = (ev) => ev.preventDefault();

	var onDrop = (ev, x, y) => {
		ev.preventDefault();
		game.checkMove(x, y);
	}

	var onDragStart = (ev, x, y) => {
		game.selectSquare(x, y);
	}

	
/*	var socket = io('http://localhost:3000');

	socket.on('news', function(data){
		console.log(data);
		socket.emit('receive', { my: 'data' });
	});

	socket.emit('join_room', { 'room_id': });
	
	socket.on('msg', function(data){
		console.log(data);
	});*/