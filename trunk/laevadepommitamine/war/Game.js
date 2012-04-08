function Game(gameId, playerType) {
	this.gameId = gameId;
	this.isOpponent = playerType == 'opponent';
	Server.startGame(gameId, playerType, Client.player.field.encode());
}

Game.prototype = {
	onRender: function() {
		this.menu.onRender();
		this.playerField.onRender();
		this.opponentField.onRender();
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="game" class="screen"></div>');

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
		    	Client.startLobby();
		    }}),
		    new Button("L&otilde;peta m&auml;ng", {scope: this, fn: function() {
		    	Client.stopGame();
		    }}),
		]);
		el.append(this.menu.render());

		var onMouseDown = function(e) {
			if (e.button != 0) {
				return;
			}
			e.preventDefault();
			if (this.currentPlayer !== Client.player) {
				return;
			}

			var fieldView = e.data;
			if (fieldView !== this.opponentField) {
				return;
			}

			var coords = fieldView.getEventCoords(e);
			if (coords) {
				var field = fieldView.field;
				if (field.hasBomb(coords)) {
					return;
				}

				Client.player.fieldCallback(this.gameId, this.isOpponent, coords);
				return;
			}
		}

		this.playerField = new FieldView(Client.player.field, {id: '1', onMouseDown: onMouseDown, scope: this, playerName: Client.player.name});
		this.opponentField = new FieldView(Client.opponent.field, {id: '2', onMouseDown: onMouseDown, scope: this, playerName: Client.opponent.name});
		el.append(this.playerField.render());
		el.append(this.opponentField.render());

		this.el = el;
		return el;
	},

	playerMoveResult: function(coords, hit) {
		this.opponentField.addBomb({x: coords.x, y: coords.y, hit: hit});
		if (hit) {
			var ship = this.opponentField.field.guessFullHit(coords);
			if (ship) {
				this.opponentField.field.addShip(ship);
				this.opponentField.setShipSunk(ship);
			}
			if (this.opponentField.field.checkBombHits()) {
				alert('Sina võitsid!');
				Client.stopGame();
			}
			return;
		} else {
			this.opponentField.testSurroundingFullHit(coords);
		}

		this.currentPlayer = Client.opponent;
		this.playerField.setStatus('');
		this.opponentField.setStatus('Ootan vastase k&auml;iku...');
		setTimeout($.proxy(this.makeMove, this), 800);
	},

	makeMove: function() {
		this.currentPlayer.makeMove(this.gameId, this.isOpponent);
	},

	remoteMoveResult: function(bombCoords) {
		if (bombCoords.x == -1 && bombCoords.y == -1) {
			setTimeout($.proxy(this.makeMove, this), 300);
			return;
		}

		var fieldView = this.playerField;
		var field = fieldView.field;
		var hit = field.checkHit(bombCoords);
		fieldView.addBomb({x: bombCoords.x, y: bombCoords.y, hit: hit});
		if (hit) {
			var ship = field.checkFullHit(bombCoords);
			if (ship) {
				fieldView.setShipSunk(ship);
			}
			if (this.playerField.field.checkBombHits()) {
				alert('Sa kaotasid!');
				Client.stopGame();
				return;
			}
		} else {
			fieldView.setStatus('Sinu kord!');
			this.opponentField.setStatus('');
			this.currentPlayer = Client.player;
		}
		setTimeout($.proxy(this.makeMove, this), 800);
	},

	gameStarted: function(firstMove) {
		this.firstMove = firstMove;

		this.playerField.setStatus('Ootan vastast...');
		this.opponentField.setStatus('');

		this.isOpponentReady();
	},

	isOpponentReady: function() {
		Server.isOpponentReady(this.gameId, this.isOpponent);
	},

	isOpponentReadyCallback: function(ready) {
		if (!ready) {
			setTimeout($.proxy(this.isOpponentReady, this), 500);
			return;
		}

		var p1status, p2status;

		if (this.firstMove) {
			this.currentPlayer = Client.player;
			p1status = "Sinu kord!";
			p2status = '';
		} else {
			this.currentPlayer = Client.opponent;
			p1status = '';
			p2status = "Ootan vastase k&auml;iku...";
		}

		this.playerField.setStatus(p1status);
		this.opponentField.setStatus(p2status);

		setTimeout($.proxy(this.makeMove, this), 800);
	}
};
