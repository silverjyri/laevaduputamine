function Lobby() {
	
}
Lobby.prototype = new Screen();
Lobby.constructor = Lobby;

Lobby.prototype.render = function() {
	if (this.el) {
		this.startBtn.onRender();
		this.loginBtn.onRender();
		this.chartBtn.onRender();
		this.historyBtn.onRender();
		return this.el;
	}
	
	var el = $('<div id="lobby" class="screen">' +
		'<div id="menu"></div>' +
		'<div id="lists"></div>' +
	'</div>');
	
	var menu = el.children("#menu");
	this.startBtn = new Button("Alusta m&auml;ngu", {scope: this, fn: function() {
		Client.startPlacement();
	}});
	this.loginBtn = new Button("Logi sisse");
	this.chartBtn = new Button("Edetabel");
	this.historyBtn = new Button("Ajalugu");
	menu.append(this.startBtn.render());
	menu.append(this.loginBtn.render());
	menu.append(this.chartBtn.render());
	menu.append(this.historyBtn.render());

	var lists = el.children("#lists");
	var gamesList = new ListBox({id: "gameslist"});
	gamesList.add("Game 1");
	gamesList.add("Game 2");
	gamesList.add("Game 4");
	gamesList.add("Game 5");
	gamesList.add("Game 6");
	gamesList.add("Game 7");
	this.gamesList = gamesList;
	var playersList = new ListBox({id: "playerslist"});
	menu.append(gamesList.render());
	menu.append(playersList.render());

	this.el = el;
	return el;
};