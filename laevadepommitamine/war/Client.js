Client = {};

$LAB
.script("ui/Button.js")
.script("ui/ListItem.js")
.script("ui/Menu.js")
.script("Screen.js")
.wait()
.script("ui/ListBox.js")
.wait()
.script("Lobby.js")
.wait(function() {
	//Client.startLobby();
})
.script("ShipFloating.js")
.script("Placement.js")
.script("FieldView.js")
.script("controller/Player.js")
.script("controller/AI.js")
.script("controller/Field.js")
.wait(function() {
	Client.startPlacement();
})
.script("Game.js");

Client.startLobby = function() {
	this.lobby = this.lobby || new Lobby();
	$("#screen_container").html(this.lobby.render());
	this.lobby.onRender();
};

Client.startPlacement = function() {
	this.placement = this.placement || new Placement();
	$("#screen_container").html(this.placement.render());
	this.placement.onRender();
};

Client.startGame = function() {
	this.game = this.game || new Game(this.placement.field.ships);
	$("#screen_container").html(this.game.render());
	this.game.onRender();
};
