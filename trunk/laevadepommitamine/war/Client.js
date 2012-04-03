Client = {};
window.Client = Client;

if (!window.Server) {
	window.Server = {};
}
Server = window.Server;

Client.rand = function(n) {
	return Math.floor(Math.random()*(n+1));
};

Client.isString = function(value) {
    return typeof value === 'string';
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
	var username;
	if (this.lobby) {
		this.lobby.username.setEnabled(false);
		username = this.lobby.username.getText();
	}
	this.placement = this.placement || new Placement(username);
	this.setScreen(this.placement);
};

Client.startGame = function() {
	this.game = this.game || new Game(this.placement.gameId, this.placement.player);
	this.setScreen(this.game);
};

Client.startRankings = function() {
	this.rankings = this.rankings || new Rankings();
	this.setScreen(this.rankings);
};

Client.stopGame = function() {
	if (this.lobby) {
		this.lobby.username.setEnabled(true);
	}
	delete this.placement;
	delete this.game;
	Client.startLobby();
}

$LAB
.script("ui/components/Button.js")
.script("ui/components/ListItem.js")
.script("ui/components/Menu.js")
.script("ui/components/TextField.js")
.wait()
.script("ui/components/ListBox.js")
.wait()
.script("Lobby.js")
.wait(function() {
	Client.startLobby();
})
.script("ui/ShipFloating.js")
.script("Placement.js")
.script("ui/FieldView.js")
.script("controller/LocalPlayer.js")
.script("controller/WebPlayer.js")
.script("controller/AIPlayer.js")
.script("controller/Field.js")
.wait(function() {
	//Client.startPlacement();
})
.script("Game.js")
.script("Rankings.js");
