function Replay(gameId) {
	this.gameId = gameId;
	this.playInterval = 1000;

	this.hasLocalStorage = Modernizr.localstorage;
}

Replay.prototype = {
	onRender: function() {
		this.menu.onRender();

		if (!this.renderedReplayData) {
			var replayData;
			if (!this.hasLocalStorage) {
				//alert('Local Storage not supported!');
			} else {
				replayData = localStorage.getItem('history' + this.gameId);
			}

			if (replayData) {
				this.setReplayData(JSON.parse(replayData));
			} else {
				// Game not found in local storage, fetch from server.
				Server.getGameReplayData(gameId);
			}
			this.renderedReplayData = true;
		}
	},

	setReplayData: function(data) {
		this.playerField.setPlayerName(data.player);
		this.playerField.field.decode(data.playerField);
		this.playerField.setShips(this.playerField.field.ships);
		this.opponentField.setPlayerName(data.opponent);
		this.opponentField.field.decode(data.opponentField);
		this.opponentField.setShips(this.opponentField.field.ships);
		this.moveHistory = data.moveHistory;
		this.moveHistoryPosition = 0;
		this.currentPlayer = data.playerStarts;
	},

	getGameReplayDataCallback: function(player, opponent, playerField, opponentField, moveHistory, playerStarts) {
		var data = {player: player, opponent: opponent, playerField: playerField, opponentField: opponentField,
			moveHistory: moveHistory, playerStarts: playerStarts}
		localStorage.setItem('history' + this.gameId, JSON.stringify(data));
		this.setReplayData(data);
	},

	makeMove: function() {
		var playerField = this.currentPlayer ? this.playerField : this.opponentField;
		var opponentField = this.currentPlayer ? this.playerField : this.opponentField;
		var pos = this.moveHistoryPosition * 2;
		var move = this.moveHistory.substring(pos, pos+2);
		var x = parseInt(move / 10);
		var y = parseInt(move % 10);
		var bomb = {x: x, y: y};
		var hit = opponentField.field.checkHit(bomb);
		bomb.hit = hit;
		opponentField.addBomb(bomb);
		var sunkShip = opponentField.field.checkFullHit(bomb);
		if (sunkShip) {
			opponentField.setShipSunk(sunkShip);
		}
		this.moveHistoryPosition++;
		if (!hit) {
			this.currentPlayer = !this.currentPlayer;
		}

		if (this.moveHistory.length == pos) {
			this.playBtn.setEnabled(false);
			this.forwardBtn.setEnabled(false);
			if (this.playTimer) {
				clearTimeout(this.playTimer);
				delete this.playTimer;
				this.playBtn.setImage('img/play.png');
			}
		} else if (this.moveHistoryPosition != 0) {
			this.backBtn.setEnabled(true);
			this.playBtn.setEnabled(true);
		}
	},

	makeMoveBack: function() {
		var playerField = this.currentPlayer ? this.playerField : this.opponentField;
		var opponentField = this.currentPlayer ? this.playerField : this.opponentField;
		var pos = this.moveHistoryPosition * 2;
		var move = this.moveHistory.substring(pos, pos+2);
		var x = parseInt(move / 10);
		var y = parseInt(move % 10);

		this.moveHistoryPosition--;
		if (this.moveHistoryPosition == 0) {
			this.backBtn.setEnabled(false);
		}
	},

	playMoves: function() {
		this.makeMove();
		this.playTimer = setTimeout(this.playMoves.bind(this), this.playInterval);
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="replay" class="screen"></div>');

		this.backBtn = new Button("Samm tagasi", {image: 'img/back.png', disabled: true, scope: this, fn: this.makeMoveBack});
		this.playBtn = new Button("M&auml;ngi", {image: 'img/play.png', scope: this, fn: function() {
			if (this.playTimer) {
				clearTimeout(this.playTimer);
				delete this.playTimer;
				this.playBtn.setImage('img/play.png');
			} else {
		    	this.playBtn.setImage('img/pause.png');
				this.playMoves();
			}
	    }});
		this.forwardBtn = new Button("Samm edasi", {image: 'img/forward.png', scope: this, fn: this.makeMove});

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
		    	Client.startLobby();
		    }}),
		    this.backBtn,
		    this.playBtn,
		    this.forwardBtn
		]);
		el.append(this.menu.render());

		var fieldDiv = $('<div style="clear: both; padding-top: 10px"></div>');
		this.playerField = new FieldView(new Field(), {id: '1'});
		this.opponentField = new FieldView(new Field(), {id: '2'});
		fieldDiv.append(this.playerField.render());
		fieldDiv.append(this.opponentField.render());
		el.append(fieldDiv);
		
		this.el = el;
		return el;
	}
};
