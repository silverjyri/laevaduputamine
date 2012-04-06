function Game(gameId) {
	this.gameId = gameId;
	this.currentPlayer = Client.rand(1) ? Client.player : Client.opponent;

	var fieldEnc = Field.encodeField(Client.player.ships, {});
	Server.startGame(gameId, fieldEnc);
}

Game.prototype = {
	onRender: function() {
		this.menu.onRender();
		this.field1.onRender();
		this.field2.onRender();
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="placement" class="screen"></div>');

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
			if (this.currentPlayer === Client.player) {
				var field = e.data;
				if (e.data === this.field2) {
					var coords = field.getEventCoords(e);
					if (coords) {
						if (field.hasBomb(coords)) {
							return;
						}

						var hit = Client.opponent.checkHit(coords);
						field.addBomb({x: coords.x, y: coords.y, hit: hit});
						if (hit) {
							var fullHit = Field.checkFullHit(Client.opponent.ships, field.bombs, coords);
							if (fullHit) {
								field.setShipSunk(fullHit);
							}
							return;
						}

						this.currentPlayer = Client.opponent;
						this.field1.setStatus('');
						field.setStatus('Ootan vastase k&auml;iku...');
						setTimeout($.proxy(this.remoteMove, this), 400);
					}
				}
			}
		}

		var p1status = (this.currentPlayer === Client.player) ? "Sinu kord!" : '';
		var p2status = (this.currentPlayer === Client.opponent) ? "Ootan vastase k&auml;iku..." : '';
		this.field1 = new FieldView(Client.player, {id: '1', onMouseDown: onMouseDown, scope: this, status: p1status});
		this.field2 = new FieldView(Client.opponent, {id: '2', onMouseDown: onMouseDown, scope: this, status: p2status});
		el.append(this.field1.render());
		el.append(this.field2.render());

		this.el = el;
		return el;
	},

	remoteMove: function() {
		this.currentPlayer.makeMove(this.gameId);
	},

	remoteMoveResult: function(bombCoords) {
		var player = this.currentPlayer;
		var opponent = (player === Client.player) ? Client.opponent : Client.player;
		var playerField, opponentField;
		if (player === Client.player) {
			playerField = this.field1;
			opponentField = this.field2;
		} else {
			playerField = this.field2;
			opponentField = this.field1;
		}

		var hit = opponent.checkHit(bombCoords);
		player.moveResult(bombCoords, hit);
		opponentField.addBomb({x: bombCoords.x, y: bombCoords.y, hit: hit});
		if (hit) {
			var fullHit = Field.checkFullHit(opponent.ships, opponentField.bombs, bombCoords);
			if (fullHit) {
				opponentField.setShipSunk(fullHit);
			}
		} else {
			opponentField.setStatus('Sinu kord!');
			playerField.setStatus('');
			this.currentPlayer = opponent;
		}
		setTimeout($.proxy(this.remoteMove, this), 800);
	},

	gameStarted: function() {
		this.currentPlayer.makeMove(this.gameId);
	}
};