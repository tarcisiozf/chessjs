
	class piecesAttributes {

		constructor() {

			var self = this;

			// Attack has the same rules of movement
			let attackIsMove = function(piece, dest_x, dest_y){
				return this.canMove(piece, dest_x, dest_y);
			};

			let checkByPosition = function(piece, dest_x, dest_y) {
				return 	this.positions
							.map( pos => ( 
								piece.x + pos[0] == dest_x && 
								piece.y + pos[1] == dest_y 
							))
							.filter( pos => pos )
							.length > 0; // at least of position must be true
			}

			// Pawn attributes
			this.pawn = {

				canMove: function(piece, dest_x, dest_y) {

					var step = (piece.player)
								? 1 // otherwise it will move down
								: -1; // light player will move up

					if ( piece.y + step == dest_y && piece.x == dest_x ) 
						return true;
					if ( piece.y + (step * 2) == dest_y && piece.x == dest_x ) 
						return true;
				},

				canAttack: function(piece, dest_x, dest_y) {

					if ( piece.player ) { // dark player
						if ( piece.y + 1 == dest_y && piece.x - 1 == dest_x ) // bottom_left
							return true;
						if ( piece.y + 1 == dest_y && piece.x + 1 == dest_x ) // bottom_right
							return true;
					} else { // light player
						if ( piece.y - 1 == dest_y && piece.x - 1 == dest_x ) // top_left
							return true;
						if ( piece.y - 1 == dest_y && piece.x + 1 == dest_x ) // top_right
							return true;
					}

				},

				canJump: false,

			}

			// Knight attributes
			this.knight = {

				//	[x, y]
				positions: [
					[1, -2],	// 1 o'clock
					[2, -1],	// 2 o'clock
					[2, 1],		// 4 o'clock
					[1, 2],		// 5 o'clock
					[-1, 2],	// 7 o'clock
					[-2, 1],	// 8 o'clock
					[-2, -1],	// 10 o'clock
					[-1, -2],	// 11 o'clock
				],

				canMove: checkByPosition,
				canAttack: attackIsMove,
				canJump: true,
			}

			// King attributes
			this.king = {

				positions: [
					[-1, -1], 	// top left
					[0, -1], 	// top center
					[1, -1], 	// top right
					[-1, 0], 	// middle left
					[1, 0], 	// middle right
					[-1, 1], 	// bottom left
					[0, 1], 	// bottom center
					[1, 1], 	// bottom right
				],

				canMove: checkByPosition,
				canAttack: attackIsMove,
				canJump: false,
			}

			// Rook attributes
			this.rook = {

				canMove: function(piece, dest_x, dest_y) {

					if ( piece.x != dest_x && piece.y == dest_y ) // vertical
						return true;
					if ( piece.x == dest_x && piece.y != dest_y ) // horizontal
						return true;

				},

				canAttack: attackIsMove,
				canJump: false,
			}

			// Bishop attributes
			this.bishop = {

				canMove: function(piece, dest_x, dest_y) {

					var diff_x = dest_x - piece.x;
					var diff_y = dest_y - piece.y;

					// The cartesian coordinates is upside-down!

					if ( diff_x == diff_y ) // first quadrant and third quadrant
						return true;
					if ( -diff_x == diff_y ) // second quadrant
						return true;
					if ( diff_x == -diff_y ) // forth quadrant
						return true;

				},

				canAttack: attackIsMove,
				canJump: false,
			}

			// Queen attributes
			this.queen = {

				canMove: function(piece, dest_x, dest_y) {

					// Queen movements are the merge of bishop and rook movements:
					if ( self.bishop.canMove(piece, dest_x, dest_y) || 
						 self.rook.canMove(piece, dest_x, dest_y) )
						return true;

				},

				canAttack: attackIsMove,
				canJump: false,
			}

		}

		parse(square) {
			if ( square === 'empty' )
				return;

			var info = square.split('_');
			info[1] = Number(info[1]);

			return info;
		}

	}