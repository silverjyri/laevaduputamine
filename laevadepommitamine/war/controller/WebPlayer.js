function WebPlayer(name) {
	this.name = name;
	this.field = new Field();
}

WebPlayer.prototype = {
	makeMove: function(gameId, isOpponent) {
		Server.remoteMove(gameId, isOpponent);
	},

	moveResult: function(coords) {
		Client.game.remoteMoveResult(coords);
	}
};
