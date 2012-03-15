Client = {};

$LAB
.script("ui/Button.js")
.script("Screen.js")
.wait()
.script("Lobby.js")
.wait(function() {
	this.lobby = new Lobby();
	$("#screen-container").append(this.lobby.render());
});
