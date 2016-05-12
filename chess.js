
	/*
		TODO:
		all pieces movements
		all pieces attacks
		path collision
	*/

	class Chess {

		constructor() {

			// board initial position
			this.board = [
				['ro_d','kn_d','bi_d','qu_d','ki_d','bi_d','kn_d','ro_d'],
				['pa_d','pa_d','pa_d','pa_d','pa_d','pa_d','pa_d','pa_d'],
				['empt','empt','empt','empt','empt','empt','empt','empt'],
				['empt','empt','empt','empt','empt','empt','empt','empt'],
				['empt','empt','empt','empt','empt','empt','empt','empt'],
				['empt','empt','empt','empt','empt','empt','empt','empt'],
				['pa_l','pa_l','pa_l','pa_l','pa_l','pa_l','pa_l','pa_l'],
				['ro_l','kn_l','bi_l','qu_l','ki_l','bi_l','kn_l','ro_l'],
			];

			this.board[5][5] = 'pa_d';

			this.piecesAttributes = new piecesAttributes;

			// starts with player 'light'
			this.player = 0;

			// starts without any piece selected
			this.selected_piece;

			// BIND ALL METHODS TO THIS SCOPE
			this.renderBoard = this.renderBoard.bind(this);
			this.selectSquare = this.selectSquare.bind(this);
			this.getPieceOwner = this.getPieceOwner.bind(this);
			this.changeTurn = this.changeTurn.bind(this);
			this.checkMove = this.checkMove.bind(this);
			this.unselectSquare = this.unselectSquare.bind(this);

			// Draw the table
			this.renderBoard();
		}

		getPieceOwner(player) {
			return { 'l': 0, 'd': 1 }[player];
		}

		checkMove(x, y) {

			// check if the player clicked at same square, if true, unselect piece
			if ( this.selected_piece.x == x && this.selected_piece.y == y ) {
				this.selected_piece = null;
				this.unselectSquare(x, y);

				return;
			}

			var destHasPiece = this.destinationHasPiece(x, y);
			var isEnemy = this.isOpponentPiece(x, y);
			var piece = this.piecesAttributes[this.selected_piece.piece]; // Rules of movements, attacks and etc 

			if ( destHasPiece && ! isEnemy ) {

				this.showMessage("That square is already occupied!");
				return;

			} else if ( destHasPiece && isEnemy ) {

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

				this.movePiece(x, y);
			}

			this.changeTurn();

		}

		isOpponentPiece(x, y) {
			var piece;
			var player;

			[piece, player] = this.piecesAttributes.parse(this.board[y][x]) || [];

			if ( this.player != this.getPieceOwner(player) ) 
				return true;
		}

		destinationHasPiece(x, y) {
			if (this.board[y][x] != 'empt')
				return true;
		}

		showMessage(message) {
			document.querySelector('.message').innerHTML = message;
			setTimeout(() => this.showMessage(''), 2000);
		}

		unselectSquare(x, y) {
			document.querySelector(`#img_${x}_${y}`).style.backgroundColor = 'transparent';
		}

		selectSquare(x, y) {

			// Transform the string into piece and player
			var square = this.board[y][x];
			var piece;
			var player 

			[piece, player] = this.piecesAttributes.parse(square) || [];

			// a piece was choose before, time to make the move
			if ( this.selected_piece ) {	
				this.checkMove(x, y);
				return;
			}

			// You can't choose a empty square
			if ( square === 'empt' ) 
				return;

			// Check if the player can choose that piece
			player = this.getPieceOwner(player);

			if ( player != this.player ) {	
				this.showMessage("You can't choose a opponent piece!");
				return;
			}

			// Save the piece to make the move
			this.selected_piece = { player, piece, x, y };

			document.querySelector(`#img_${x}_${y}`).style.backgroundColor = '#D3C139';
		}

		movePiece(x, y) {
			this.unselectSquare(this.selected_piece.x, this.selected_piece.y);

			var tmp = this.board[y][x];

			this.board[y][x] = `${this.selected_piece.piece}_${['l','d'][this.selected_piece.player]}`;
			this.board[this.selected_piece.y][this.selected_piece.x] = tmp;

			this.selected_piece = null;

			this.renderBoard();
		}

		attackPiece(x, y) {
			this.unselectSquare(this.selected_piece.x, this.selected_piece.y);

			this.board[y][x] = `${this.selected_piece.piece}_${['l','d'][this.selected_piece.player]}`;
			this.board[this.selected_piece.y][this.selected_piece.x] = 'empt';

			this.selected_piece = null;

			this.renderBoard();
		}

		changeTurn() {
			this.player ^= 1;
			this.showMessage(`Now it's ${['Light','Dark'][this.player]} player turn`);
		}

		renderBoard() {

			const bg_colors = ['#FFF','#494949'];
			var color = 1;

			var html = '<table>';

			for ( var y in this.board ) {

				html += '<tr>';

				for( var x in this.board[y] ) {

					var piece = this.board[y][x];

					html += `
						<td style='background-color: ${bg_colors[color]};' >
							<img 
								id='img_${x}_${y}'
								onClick='game.selectSquare(${x}, ${y})'
								src='images/pieces/${piece}.png'
							/>
						</td>
					`;

					// toggle square color
					color ^= 1;
				}

				html += '</tr>';

				// toggle square color
				color ^= 1;
			}

			document.querySelector('#board').innerHTML = html;

		}

	}

	var game = new Chess;