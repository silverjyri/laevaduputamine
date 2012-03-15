Client = {};

$LAB
.script("ui/Button.js")
.script("ui/ListItem.js")
.script("Screen.js")
.wait()
.script("ui/ListBox.js")
.script("Lobby.js")
.script("Placement.js")
.wait(function() {
	Client.startLobby();
});

Client.startLobby = function() {
	this.lobby = this.lobby || new Lobby();
	$("#screen_container").html(this.lobby.render());
};

Client.startPlacement = function() {
	this.placement = this.placement || new Placement();
	$("#screen_container").html(this.placement.render());
};
