Client = {};

$LAB
.script("ui/Button.js")
.script("ui/ListItem.js")
.script("Screen.js")
.wait()
.script("ui/ListBox.js")
.script("Lobby.js")
.wait();

$(document).ready(function() {
	this.lobby = new Lobby();
	$("#screen_container").append(this.lobby.render());
});
