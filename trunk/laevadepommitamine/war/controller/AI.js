function AI() {
	this.ships = AI.generateShips();
	this.name = "AI";
}

AI.generateShips = function() {
	var ships = {};
	var ship = {x:1, y: 2, length: 3, vertical: true};
	ships['' + ship.x + ship.y] = ship;
	return ships;
};

AI.prototype = {
checkHit: function(coords) {
	var ships = this.ships;
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
}
};
