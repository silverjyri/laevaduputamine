// Maintains the list of ships and bombs on a field.
function Field() {
	this.ships = {};
	this.bombs = {};
}

Field.prototype = {
	addShip : function(ship) {
		if (!this.checkLocation(ship)) {
			return false;
		}
		this.ships['' + ship.x + ship.y] = ship;
		return true;
	},

	removeShip : function(ship) {
		delete this.ships['' + ship.x + ship.y];
	},

	hasBomb: function(coords) {
		return !!this.bombs['' + coords.x + coords.y];
	},

	// Checks if there is a ship at the given coordinates
	checkHit : function(coords) {
		for ( var i in this.ships) {
			var ship = this.ships[i];
			var sw = ship.vertical ? 1 : ship.length;
			var sh = ship.vertical ? ship.length : 1;
			if ((coords.x >= ship.x) && (coords.x < ship.x + sw) &&
				(coords.y >= ship.y) && (coords.y < ship.y + sh)) {
				return true;
			}
		}
		return false;
	},

	// Checks if there is a ship at the given coordinates which is completely
	// bombed
	checkFullHit : function(coords) {
		if (!this.checkHit(coords)) {
			return null;
		}

		var ship = this.getShipAtCoords(coords);
		var x = ship.x;
		var y = ship.y;
		var vp = ship.vertical ? 1 : 0;
		var hp = ship.vertical ? 0 : 1;

		var i;
		for (i = 0; i < ship.length; i++) {
			var id = '' + (x + i * hp) + (y + i * vp);
			if (!this.bombs[id]) {
				return null;
			}
		}
		return ship;
	},

	// Checks if a ship can be placed on the field
	checkLocation : function(ship) {
		var x = ship.x;
		var y = ship.y;
		var length = ship.length;
		var vertical = ship.vertical;

		if (x < 0 || y < 0) {
			return false;
		}
		if ((vertical ? y : x) + length > 10) {
			return false;
		}

		for ( var i in this.ships) {
			var ship = this.ships[i];
			var w = vertical ? 1 : length;
			var h = vertical ? length : 1;
			var sw = ship.vertical ? 1 : ship.length;
			var sh = ship.vertical ? ship.length : 1;
			if ((x + w >= ship.x) && (x <= ship.x + sw) &&
				(y + h >= ship.y) && (y <= ship.y + sh)) {
				return false;
			}
		}

		return true;
	},

	checkShipsPlaced : function() {
		return (Client.sizeOf(this.ships) == 10);
	},

	checkBombHits : function() {
		var count = 0;
		for ( var i in this.bombs) {
			if (this.bombs[i].hit) {
				count++;
			}
		}
		// 20 bombs in total
		return count == 20;
	},

	getShipAtCoords : function(coords) {
		if (!coords) {
			return false;
		}

		for ( var i in this.ships) {
			var ship = this.ships[i];
			var sw = ship.vertical ? 1 : ship.length;
			var sh = ship.vertical ? ship.length : 1;
			if ((coords.x >= ship.x) && (coords.x < ship.x + sw) &&
				(coords.y >= ship.y) && (coords.y < ship.y + sh)) {
				return ship;
			}
		}
	},

	// Guess if there is a ship at the given coordinates which is completely bombed.
	// The ships on this field are not all known, so need to look at surrounding boxes.
	// Assuming coords was a hit.
	guessFullHit : function(coords) {
		// Try to find the start of the ship (upper-left part)
		var x1 = coords.x;
		var y1 = coords.y;
		var id;
		while (1) {
			if (x1 == 0) {
				break;
			}
			id = '' + (x1 - 1) + y1;
			if (!this.bombs[id]) {
				break;
			}
			if (!this.bombs[id].hit) {
				break;
			}
			x1--;
		}
		while (1) {
			if (y1 == 0) {
				break;
			}
			id = '' + x1 + (y1 - 1);
			if (!this.bombs[id]) {
				break;
			}
			if (!this.bombs[id].hit) {
				break;
			}
			y1--;
		}

		// Try to find the end of the ship (bottom-right part)
		var x2 = coords.x;
		var y2 = coords.y;
		var id;
		while (1) {
			if (x2 == 9) {
				break;
			}
			id = '' + (x2 + 1) + y2;
			if (!this.bombs[id]) {
				break;
			}
			if (!this.bombs[id].hit) {
				break;
			}
			x2++;
		}
		while (1) {
			if (y2 == 9) {
				break;
			}
			id = '' + x2 + (y2 + 1);
			if (!this.bombs[id]) {
				break;
			}
			if (!this.bombs[id].hit) {
				break;
			}
			y2++;
		}

		// Test ship direction
		var vertical;
		if (x1 == x2 && y1 != y2) {
			vertical = true;
		} else if (x1 != x2 && y1 == y2) {
			vertical = false;
		}

		// If we have a direction, just check the endpoints, unless it's already a quad ship
		var hasShip = false;
		var length;
		if (vertical === true) {
			length = y2 - y1 + 1;
			if ((y1 == 0 || this.bombs['' + x1 + (y1 - 1)]) &&
				(y2 == 9 || this.bombs['' + x2 + (y2 + 1)])) {
				hasShip = true;
			}
		} else if (vertical === false) {
			length = x2 - x1 + 1;
			if ((x1 == 0 || this.bombs['' + (x1 - 1) + y1]) &&
				(x2 == 9 || this.bombs['' + (x2 + 1) + y2])) {
				hasShip = true;
			}
		} else {
			length = 1;
			// No direction, check if it's a single
			if ((y1 == 0 || this.bombs['' + x1 + (y1 - 1)]) &&
				(y2 == 9 || this.bombs['' + x2 + (y2 + 1)]) &&
				(x1 == 0 || this.bombs['' + (x1 - 1) + y1]) &&
				(x2 == 9 || this.bombs['' + (x2 + 1) + y2])) {
				hasShip = true;
			}
		}

		if (hasShip || this.shipCheckLargerFullHit(length)) {
			var ship = {x: x1, y: y1, length: length, vertical: vertical};
			return ship;
		}
		return null;
	},

	// If we know that there is a sunken 4-ship, then we also know that a ship with 3 bombs has been sunk.
	// Check for this condition.
	shipCheckLargerFullHit : function(length) {
		var shipsLeft = {
			1 : 4,
			2 : 3,
			3 : 2,
			4 : 1
		};
		for ( var i in this.ships) {
			shipsLeft[this.ships[i].length]--;
		}

		for ( var l = length + 1; l <= 4; l++) {
			if (shipsLeft[l] != 0) {
				return false;
			}
		}
		return true;
	},

	// Returns a 100-character string that represents the playing field
	// 0 - empty
	// 1 - horizontal single
	// 2 - horizontal double
	// 3 - horizontal triple
	// 4 - horizontal quad
	// 5 - vertical double
	// 6 - vertical triple
	// 7 - vertical quad
	// a - bomb only
	// b-h instead of 1-7 to mark bomb+ship
	encode : function() {
		var x, y, id;
		var field = '';
		var digit;
		for (y = 0; y < 10; y++) {
			for (x = 0; x < 10; x++) {
				id = '' + x + y;
				var ship = this.ships[id];
				var bomb = this.bombs[id];
				if (ship) {
					digit = ship.length;
					if (ship.length != 1 && ship.vertical) {
						digit += 3;
					}
				} else {
					digit = 0;
				}
				if (bomb) {
					digit += 'a'.charCodeAt(0);
				} else {
					digit += '0'.charCodeAt(0);
				}
				field += String.fromCharCode(digit);
			}
		}
		return field;
	},

	generateRandomShips : function() {
		this.ships = {};
		var lengths = [ 4, 3, 3, 2, 2, 2, 1, 1, 1, 1 ];
		for (l in lengths) {
			var valid = false;
			while (!valid) {
				var ship = {
					x : Client.rand(9),
					y : Client.rand(9),
					length : lengths[l],
					vertical : Client.rand(1)
				};
				if (ship.length == 1 && ship.vertical) {
					ship.vertical = false;
				}
				valid = this.checkLocation(ship);
			}
			this.ships['' + ship.x + ship.y] = ship;
		}
	}
};
