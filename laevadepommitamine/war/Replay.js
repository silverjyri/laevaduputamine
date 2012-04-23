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
				Client.getGameReplayData(this.gameId);
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
		this.moveHistoryEnd = this.moveHistory.length / 2;
		// unknown at first, calculated based on moves
		this.turnHistory = new Array(this.moveHistoryEnd);
		this.turnHistory[0] = data.playerStarts;
	},

	makeMove: function() {
		var currentPlayer = this.turnHistory[this.moveHistoryPosition];
		var opponentField = currentPlayer ? this.opponentField : this.playerField;
		var pos = this.moveHistoryPosition * 2;
		var move = this.moveHistory.substring(pos, pos+2);
		var x = parseInt(move / 10);
		var y = parseInt(move % 10);
		var bomb = {x: x, y: y};
		var hit = opponentField.field.checkHit(bomb);
		bomb.hit = hit;
		opponentField.addBomb(bomb, true);

		this.moveHistoryPosition++;
		if (hit) {
			var sunkShip = opponentField.field.checkFullHit(bomb);
			if (sunkShip) {
				opponentField.setShipSunk(sunkShip);
			}
			this.turnHistory[this.moveHistoryPosition] = currentPlayer;
		} else {
			this.turnHistory[this.moveHistoryPosition] = !currentPlayer;
		}

		if (this.moveHistoryPosition == this.moveHistoryEnd) {
			this.playBtn.setEnabled(false);
			this.forwardBtn.setEnabled(false);
			this.pause();
		} else if (this.moveHistoryPosition != 0) {
			this.backBtn.setEnabled(true);
			this.playBtn.setEnabled(true);
		}
	},

	makeMoveBack: function() {
		this.moveHistoryPosition--;
		var currentPlayer = this.turnHistory[this.moveHistoryPosition];
		var pos = this.moveHistoryPosition * 2;
		var move = this.moveHistory.substring(pos, pos+2);
		var x = parseInt(move / 10);
		var y = parseInt(move % 10);

		var opponentField = currentPlayer ? this.opponentField : this.playerField;
		opponentField.removeBomb({x: x, y: y});
		
		if (this.moveHistoryPosition == 0) {
			this.backBtn.setEnabled(false);
		} else {
			this.playBtn.setEnabled(true);
			this.forwardBtn.setEnabled(true);
		}
	},

	playMoves: function() {
		this.playTimer = setTimeout(this.playMoves.bind(this), this.playInterval);
		this.makeMove();
	},

	pause: function() {
		if (this.playTimer) {
			clearTimeout(this.playTimer);
			delete this.playTimer;
			this.playBtn.setImage('img/play.png');
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="replay" class="screen"></div>');

		this.backBtn = new Button("Samm tagasi", {image: 'img/back.png', disabled: true, scope: this, fn: this.makeMoveBack});
		this.playBtn = new Button("M&auml;ngi", {image: 'img/play.png', scope: this, fn: function() {
			if (this.playTimer) {
				this.pause();
			} else {
		    	this.playBtn.setImage('img/pause.png');
				this.playMoves();
			}
	    }});
		this.forwardBtn = new Button("Samm edasi", {image: 'img/forward.png', scope: this, fn: this.makeMove});

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
	  	    	delete Client.replay;
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
