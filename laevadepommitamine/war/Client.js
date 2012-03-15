Client = {};

$LAB
.script("ui/Button.js")
.script("ui/ListBox.js")
.script("Screen.js")
.wait()
.script("Lobby.js")
.wait(function() {
	this.lobby = new Lobby();
	$("#screen_container").append(this.lobby.render());
});
