function Lobby() {
	
}
Lobby.prototype = new Screen();
Lobby.constructor = Lobby;

Lobby.prototype.onRender = function() {
	this.menu.onRender();
},

Lobby.prototype.render = function() {
	if (this.el) {
		return this.el;
	}
	
	var el = $('<div id="lobby" class="screen"></div>');

	this.menu = new Menu([
  	    new Button("Esileht", {image: 'img/home.png'}),
  	    new Button("Alusta m&auml;ngu", {scope: this, fn: function() {
  	    	Client.startPlacement();
  	    }}),
  	    new Button("Logi sisse"),
  	    new Button("Edetabel"),
  	    new Button("Ajalugu")
  	]);
  	el.append(this.menu.render());

	var lists = $('<div id="lists"></div>');
	var gamesList = new ListBox();
	gamesList.add("Game 1");
	gamesList.add("Game 2");
	gamesList.add("Game 4");
	gamesList.add("Game 5");
	gamesList.add("Game 6");
	gamesList.add("Game 7");
	this.gamesList = gamesList;
	var playersList = new ListBox();
	lists.append(gamesList.render());
	lists.append(playersList.render());
	el.append(lists);

	this.el = el;
	return el;
};