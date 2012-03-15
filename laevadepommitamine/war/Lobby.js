function Lobby() {
	
}
Lobby.prototype = new Screen();
Lobby.constructor = Lobby;

Lobby.prototype.render = function() {
	var el = $('<div id="lobby" class="screen">' +
		'<div id="menu"></div>' +
		'<div id="lists"></div>' +
	'</div>');
	
	var menu = el.children("#menu");
	var startBtn = new Button("Alusta m&auml;ngu");
	var loginBtn = new Button("Logi sisse");
	var chartBtn = new Button("Edetabel");
	var historyBtn = new Button("Ajalugu");
	menu.append(startBtn.render());
	menu.append(loginBtn.render());
	menu.append(chartBtn.render());
	menu.append(historyBtn.render());

	var lists = el.children("#lists");
	var gamesList = new ListBox({id: "gameslist"});
	gamesList.add("Game 1");
	gamesList.add("Game 2");
	gamesList.add("Game 4");
	gamesList.add("Game 5");
	gamesList.add("Game 6");
	gamesList.add("Game 7");
	var playersList = new ListBox({id: "playerslist"});
	menu.append(gamesList.render());
	menu.append(playersList.render());

	this.el = el;
	return el;
};