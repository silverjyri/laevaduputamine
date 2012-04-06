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
