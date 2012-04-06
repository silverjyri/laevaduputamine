function LocalPlayer(name) {
	this.name = name;
	this.field = new Field();
}

LocalPlayer.prototype = {
	makeMove : function(gameId, isOpponent) {
		// Nothing to do here, wait for fieldCallback from the opponent field
	},

	fieldCallback : function(gameId, isOpponent, coords) {
		this.moveCoords = coords;
		Server.playerMove(gameId, isOpponent, coords.x, coords.y);
	},
	
	moveResult : function(hit) {
		Client.game.playerMoveResult(this.moveCoords, hit);
	}
};
