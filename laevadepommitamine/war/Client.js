Client = {};
window.Client = Client;

if (!window.Server) {
	window.Server = {};
}
Server = window.Server;

Client.rand = function(n) {
	return Math.floor(Math.random() * (n + 1));
};

Client.isString = function(value) {
	return typeof value === 'string';
};

Client.sizeOf = function(obj) {
	var size = 0, key;
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

Client.setScreen = function(screen) {
	if (this.screen && this.screen.onHide) {
		this.screen.onHide();
	}
	this.screen = screen;
	$("#screen_container").html(this.screen.render());
	this.screen.onRender();
};

Client.startLobby = function() {
	this.lobby = this.lobby || new Lobby();
	this.setScreen(this.lobby);
};

Client.startPlacement = function() {
	if (!this.placement) {
		var username;
		var gameId;
		if (this.lobby) {
			this.lobby.username.setEnabled(false);
			username = this.lobby.username.getText();
			gameId = this.lobby.joinGame;
		}
		this.player = new LocalPlayer(username);
		this.placement = new Placement(gameId);
	}
	this.setScreen(this.placement);
};

Client.startGame = function() {
	if (!this.game) {
		var ai = this.placement.opponentList.selected === this.placement.aiOpponentItem;
		this.opponent = new WebPlayer(ai ? "AI" : this.placement.webOpponentItem.value);
		var playerType = this.placement.isOpponent ? 'opponent' : (ai ? 'againstai' : 'player');
		this.game = new Game(this.placement.gameId, playerType);
		delete this.placement;
	}
	this.setScreen(this.game);
};

Client.startRankings = function() {
	this.rankings = this.rankings || new Rankings();
	this.setScreen(this.rankings);
};

Client.stopGame = function() {
	if (this.lobby) {
		this.lobby.username.setEnabled(true);
		if (this.lobby.joinBtn) {
			this.lobby.joinBtn.setEnabled(true);
		}
	}
	delete this.placement;
	delete this.game;
	delete this.player;
	delete this.opponent;
	Client.startLobby();
}

$LAB
.script("ui/components/Button.js")
.script("ui/components/ListItem.js")
.script("ui/components/Menu.js")
.script("ui/components/TextField.js").wait()
.script("ui/components/ListBox.js").wait()
.script("Lobby.js").wait(function() {
	Client.startLobby();
})
.script("model/Field.js")
.script("ui/ShipFloating.js")
.script("Placement.js")
.script("ui/FieldView.js")
.script("controller/LocalPlayer.js")
.script("controller/WebPlayer.js").wait(function() {
	//Client.startPlacement();
})
.script("Game.js")
.script("Rankings.js");
