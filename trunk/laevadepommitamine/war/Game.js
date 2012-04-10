function Game(gameId, playerType) {
	this.gameId = gameId;
	Server.startGame(gameId, playerType, Client.player.field.encode());
	this.moveDelay = 300;
}

Game.prototype = {
	onRender: function() {
		this.menu.onRender();
		Client.player.fieldView.onRender();
		Client.opponent.fieldView.onRender();
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
		    	Client.player.quitGame(this.gameId);
		    }}),
		]);
		el.append(this.menu.render());

		el.append(Client.player.fieldView.render());

		var opponentField = Client.opponent.fieldView;
		opponentField.scope = this;
		opponentField.onMouseDown = function(e) {
			if (e.button != 0) {
				return;
			}
			e.preventDefault();

			if (this.currentPlayer !== Client.player) {
				return;
			}

			var coords = Client.opponent.fieldView.getEventCoords(e);
			if (coords) {
				Client.player.fieldViewCallback(coords);
			}
		};
		el.append(opponentField.render());

		this.el = el;
		return el;
	},

	makeMove: function(player) {
		setTimeout($.proxy(player ? this.makePlayerMove : this.makeOpponentMove, this), this.moveDelay);
	},

	makePlayerMove: function() {
		Client.player.fieldView.setStatus('Sinu kord!');
		Client.opponent.fieldView.setStatus('');
		this.currentPlayer = Client.player;
		this.currentPlayer.makeMove();
	},

	makeOpponentMove: function() {
		Client.player.fieldView.setStatus('');
		Client.opponent.fieldView.setStatus("Ootan vastase k&auml;iku...");
		this.currentPlayer = Client.opponent;
		this.currentPlayer.makeMove();
	},

	playerMoveResult: function(hit) {
		this.currentPlayer = null;
		this.makeMove(hit);
	},

	remoteMoveResult: function(hit) {
		this.currentPlayer = null;
		if (hit) {
			if (Client.player.field.checkAllHits()) {
				alert('Sa kaotasid!');
				Client.stopGame();
				return;
			}
		}
		this.makeMove(!hit);
	},

	gameStarted: function(firstMove) {
		this.firstMove = firstMove;

		Client.player.fieldView.setStatus('Ootan vastast...');
		Client.opponent.fieldView.setStatus('');

		this.isOpponentReady();
	},

	isOpponentReady: function() {
		Server.isOpponentReady(this.gameId, Client.player.isOpponent);
	},

	isOpponentReadyCallback: function(ready) {
		if (!ready) {
			setTimeout($.proxy(this.isOpponentReady, this), this.moveDelay);
			return;
		}

		this.makeMove(this.firstMove);
	}
};
