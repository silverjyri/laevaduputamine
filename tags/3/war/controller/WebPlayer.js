function WebPlayer(name, isOpponent) {
	this.name = name;
	this.field = new Field();
	this.fieldView = new FieldView(this.field, {id: '2', playerName: name});
	this.isOpponent = isOpponent;
}

WebPlayer.prototype = {
	makeMove: function() {
		Server.remoteMove(Client.game.gameId, Client.player.isOpponent);
	},

	moveResult: function(coords) {
		if (coords.x == -1 && coords.y == -1) {
			setTimeout($.proxy(this.makeMove, this), 10);
			return;
		}

		var player = Client.player;
		var playerField = player.field;
		var playerFieldView = player.fieldView;

		var hit = playerField.checkHit(coords);
		var bomb = {x: coords.x, y: coords.y, hit: hit};
		playerFieldView.addBomb(bomb);

		if (hit) {
			var ship = playerField.checkFullHit(bomb);
			if (ship) {
				playerFieldView.setShipSunk(ship);
			}
		}

		Client.game.remoteMoveResult(hit);
	}
};
