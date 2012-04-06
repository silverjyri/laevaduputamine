function AIPlayer() {
	this.ships = Field.generateRandomShips();
	this.bombs = {};
	this.name = "AI";
	this.enemyBombs = {};
	this.enemyShips = {};
}

AIPlayer.prototype = {
	isRemote: function() {
		return true;
	},

	checkHit: function(coords) {
		return Field.checkHit(this.ships, coords);
	},

	makeMove: function(gameId) {
		Server.remoteMove(gameId);
	},

	moveResult: function(coords, hit) {
		this.enemyBombs['' + coords.x + coords.y] = {x: coords.x, y: coords.y, hit: hit};
	}
};
