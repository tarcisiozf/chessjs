	
	/*
		-1, -1		x, -1		+1, -1

		-1, y		x, y		+1, y

		-1, +1		x, +1		+1, +1
	*/

	class piecesAttributes {

		constructor() {

			var self = this;

			// Pawn attributes
			this.pawn = {

				canMove: function(piece, dest_x, dest_y) {

					var step = (piece.player)
								? 1 // otherwise it will move down
								: -1; // light player will move up

					if ( piece.y + step == dest_y && piece.x == dest_x ) 
						return true;
					if ( piece.y + (step*2) == dest_y && piece.x == dest_x ) 
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

				canMove: function(piece, dest_x, dest_y) {

					if ( piece.x + 1 == dest_x && piece.y - 2 == dest_y ) // 1 o'clock
						return true;
					if ( piece.x + 2 == dest_x && piece.y - 1 == dest_y ) // 2 o'clock
						return true;
					if ( piece.x + 2 == dest_x && piece.y + 1 == dest_y ) // 4 o'clock
						return true;
					if ( piece.x + 1 == dest_x && piece.y + 2 == dest_y ) // 5 o'clock
						return true;
					if ( piece.x - 1 == dest_x && piece.y + 2 == dest_y ) // 7 o'clock
						return true;
					if ( piece.x - 2 == dest_x && piece.y + 1 == dest_y ) // 8 o'clock
						return true;
					if ( piece.x - 2 == dest_x && piece.y - 1 == dest_y ) // 10 o'clock
						return true;
					if ( piece.x - 1 == dest_x && piece.y - 2 == dest_y ) // 11 o'clock
						return true;

				},

				// Attack has the same rules of movement
				canAttack: (piece, dest_x, dest_y) => { return this.knight.canMove(piece, dest_x, dest_y) },

				canJump: true,

			}

			// King attributes
			this.king = {

				canMove: function(piece, dest_x, dest_y) {

					if ( piece.x - 1 == dest_x && piece.y - 1 == dest_y ) // top left
						return true;
					if ( piece.x == dest_x	   && piece.y - 1 == dest_y ) // top center
						return true;
					if ( piece.x + 1 == dest_x && piece.y - 1 == dest_y ) // top right
						return true;
					if ( piece.x - 1 == dest_x && piece.y == dest_y ) // middle left
						return true;
					if ( piece.x + 1 == dest_x && piece.y == dest_y ) // middle right
						return true;
					if ( piece.x - 1 == dest_x && piece.y + 1 == dest_y ) // bottom left
						return true;
					if ( piece.x == dest_x 	   && piece.y + 1 == dest_y ) // bottom center
						return true;
					if ( piece.x + 1 == dest_x && piece.y + 1 == dest_y ) // bottom right
						return true;

				},

				// Attack has the same rules of movement
				canAttack: (piece, dest_x, dest_y) => { return this.king.canMove(piece, dest_x, dest_y) },

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

				// Attack has the same rules of movement
				canAttack: (piece, dest_x, dest_y) => { return this.rook.canMove(piece, dest_x, dest_y) },

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

				// Attack has the same rules of movement
				canAttack: (piece, dest_x, dest_y) => { return this.bishop.canMove(piece, dest_x, dest_y) },

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

				// Attack has the same rules of movement
				canAttack: (piece, dest_x, dest_y) => { return this.queen.canMove(piece, dest_x, dest_y) },

				canJump: false,

			}

		}

		parse(square) {
			if ( ! square.match(/_/) )
				return;

			var info = square.split('_');
			info[1] = Number(info[1]);

			return info;
		}

	}