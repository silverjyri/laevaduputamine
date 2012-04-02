function Game(ships) {
	this.player1 = new AIPlayer();//new LocalPlayer("blabla", ships);
	this.player2 = new AIPlayer();
	this.currentPlayer = Client.rand(1) ? this.player1 : this.player2;
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
			if (this.currentPlayer === this.player1) {
				var field = e.data;
				if (e.data === this.field2) {
					var coords = field.getEventCoords(e);
					if (coords) {
						if (field.hasBomb(coords)) {
							return;
						}

						var hit = this.player2.checkHit(coords);
						field.addBomb({x: coords.x, y: coords.y, hit: hit});
						if (hit) {
							var fullHit = Field.checkFullHit(this.player2.ships, field.bombs, coords);
							if (fullHit) {
								field.setShipSunk(fullHit);
							}
							return;
						}

						this.currentPlayer = this.player2;
						this.field1.setStatus('');
						field.setStatus('Ootan vastase k&auml;iku...');
						setTimeout($.proxy(this.remoteMove, this), 400);
					}
				}
			}
		}

		var p1status = (this.currentPlayer === this.player1) ? "Sinu kord!" : '';
		var p2status = (this.currentPlayer === this.player2) ? "Ootan vastase k&auml;iku..." : '';
		this.field1 = new FieldView({id: '1', onMouseDown: onMouseDown, scope: this, ships: this.player1.ships, status: p1status});
		this.field2 = new FieldView({id: '2', onMouseDown: onMouseDown, scope: this, status: p2status});
		el.append(this.field1.render());
		el.append(this.field2.render());

		if (this.currentPlayer.isRemote()) {
			setTimeout($.proxy(this.remoteMove, this), 400);
		}

		this.el = el;
		return el;
	},

	remoteMove: function() {
		var player = this.currentPlayer;
		var opponent = (player === this.player1) ? this.player2 : this.player1;
		var playerField, opponentField;
		if (player === this.player1) {
			playerField = this.field1;
			opponentField = this.field2;
		} else {
			playerField = this.field2;
			opponentField = this.field1;
		}

		var bombCoords = player.makeMove();
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
	}
};