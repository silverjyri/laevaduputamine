function AIPlayer() {
	this.ships = AIPlayer.generateShips();
	this.name = "AI";
	this.enemyBombs = {};
	this.enemyShips = {};
}

AIPlayer.generateShips = function() {
	var ships = {};
	var lengths = [4,3,3,2,2,2,1,1,1,1];
	for (l in lengths) {
		var valid = false;
		while (!valid) {
			var ship = {x:Client.rand(9), y: Client.rand(9), length: lengths[l], vertical: Client.rand(1)};
			valid = Field.checkLocation(ships, ship);
		}
		ships['' + ship.x + ship.y] = ship;
	}
	return ships;
};

AIPlayer.prototype = {
checkHit: function(coords) {
	return Field.checkHit(this.ships, coords);
},

makeMove: function() {
	var valid = false;
	var bomb;
	while (!valid) {
		bomb = {x: Client.rand(9), y: Client.rand(9)};
		valid = !this.enemyBombs['' + bomb.x + bomb.y];
	}
	return bomb;
},

moveResult: function(coords, hit) {
	this.enemyBombs['' + coords.x + coords.y] = {x: coords.x, y: coords.y, hit: hit};
}
};
