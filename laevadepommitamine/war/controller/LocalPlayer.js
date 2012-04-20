function LocalPlayer(name, isOpponent) {
	this.name = name;
	this.field = new Field();
	this.fieldView = new FieldView(this.field, {id: '1', playerName: name});
	this.isOpponent = isOpponent;
}

LocalPlayer.prototype = {
	makeMove : function() {
		// Nothing to do here, wait for fieldCallback from the opponent field
	},

	moveResult : function(hit, sunk) {
		var opponent = Client.opponent;
		var opponentField = opponent.field;
		var opponentFieldView = opponent.fieldView;
		var bomb = {x: this.moveCoords.x, y: this.moveCoords.y, hit: hit};

		opponentFieldView.addBomb(bomb);
		if (sunk) {
			var ship = opponentField.getShipByBombs(bomb);
			opponentField.addShip(ship);
			opponentFieldView.setShipSunk(ship);

			if (opponentField.checkAllHits()) {
				alert('Sina v&otilde;itsid!');
				Client.stopGame();
				return;
			}
		}
		Client.game.playerMoveResult(hit);
		delete this.moveCoords;
	},

	fieldViewCallback : function(coords) {
		if (this.moveCoords) {
			return;
		}
		if (Client.opponent.field.hasBomb(coords)) {
			return;
		}

		this.moveCoords = coords;
		Server.playerMove(Client.game.gameId, this.isOpponent, coords.x, coords.y);
	},

	quitGame : function(gameId) {
		Server.quitGame(gameId, this.isOpponent);
		Client.stopGame();
	}
};
