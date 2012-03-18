function Field() {
}

Field.checkHit = function(ships, coords) {
	for (i in ships) {
		var ship = ships[i];
		var sw = ship.vertical ? 1 : ship.length;
		var sh = ship.vertical ? ship.length : 1;
		if ((coords.x >= ship.x) && (coords.x < ship.x + sw) &&
			(coords.y >= ship.y) && (coords.y < ship.y + sh)) {
			return true;
		}
	}
	return false;
};

Field.checkLocation = function(ships, ship) {
	var x = ship.x;
	var y = ship.y;
	var length = ship.length;
	var vertical = ship.vertical;
	
	if ((vertical ? y : x) + length > 10) {
		return false;
	}

	for (i in ships) {
		var ship = ships[i];
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
}

Field.getShipAtCoords = function(ships, coords) {
	if (!coords) {
		return false;
	}
	
	for (i in ships) {
		var ship = ships[i];
		var sw = ship.vertical ? 1 : ship.length;
		var sh = ship.vertical ? ship.length : 1;
		if ((coords.x >= ship.x) && (coords.x < ship.x + sw) &&
			(coords.y >= ship.y) && (coords.y < ship.y + sh)) {
			return ship;
		}
	}
}
