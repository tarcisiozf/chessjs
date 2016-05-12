	
	/*
		-1, -1		x, -1		+1, -1

		-1, y		x, y		+1, y

		-1, +1		x, +1		+1, +1
	*/

	class piecesAttributes {

		constructor() {

			// Pawn attributes
			this.pa = {

				canMove: function(piece, dest_x, dest_y) {

					var step = (piece.player)
								? 1 // otherwise it will move down
								: -1; // light player will move up

					if ( piece.y + step == dest_y && piece.x == dest_x ) 
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

			}

		}

		parse(square) {
			if ( ! square.match(/_/) )
				return;

			return square.split('_');
		}

	}