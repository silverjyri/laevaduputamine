Client = {};

$LAB
.script("ui/Button.js")
.script("ui/ListItem.js")
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
.script("Field.js")
.wait(function() {
	Client.startPlacement();
});

Client.startLobby = function() {
	this.lobby = this.lobby || new Lobby();
	$("#screen_container").html(this.lobby.render());
};

Client.startPlacement = function() {
	this.placement = this.placement || new Placement();
	$("#screen_container").html(this.placement.render());
};
