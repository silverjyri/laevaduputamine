function AI() {
	this.ships = AI.generateShips();
	this.name = "AI";
}

AI.rand = function(n) {
	return Math.floor(Math.random()*(n+1));
};

AI.generateShips = function() {
	var ships = {};
	var lengths = [4,3,3,2,2,2,1,1,1,1];
	for (l in lengths) {
		var valid = false;
		while (!valid) {
			var ship = {x:AI.rand(9), y: AI.rand(9), length: lengths[l], vertical: AI.rand(1)};
			valid = Field.checkLocation(ships, ship);
		}
		ships['' + ship.x + ship.y] = ship;
	}
	return ships;
};

AI.prototype = {
checkHit: function(coords) {
	return Field.checkHit(this.ships, coords);
}
};
