function Replay(gameId) {
	this.gameId = gameId;

	this.hasLocalStorage = Modernizr.localstorage;
	if (!this.hasLocalStorage) {
		alert('Local Storage not supported!');
	} else {
		this.replayData = localStorage.getItem('history' + gameId);
	}
	
	if (!this.replayData) {
		// Game not found in local storage, fetch from server.
		Server.getGameReplayData(gameId);
	}
}

Replay.prototype = {
	onRender: function() {
		this.menu.onRender();
	},

	getGameReplayDataCallback: function(player, opponent, playerField, opponentField, moveHistory, playerStarts) {
		console.log(arguments);
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="replay" class="screen"></div>');

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
		    	Client.startLobby();
		    }}),
		    new Button("Back", {image: 'img/back.png', scope: this, fn: function() {
		    	
		    }}),
		    new Button("Play", {image: 'img/pause.png', scope: this, fn: function() {
		    	
		    }}),
		    new Button("Forward", {image: 'img/forward.png', scope: this, fn: function() {
		    	
		    }}),
		]);
		el.append(this.menu.render());

		//el.append(playerField.render());
		//el.append(opponentField.render());

		this.el = el;
		return el;
	}
};
