function Lobby() {
	
}
Lobby.prototype = new Screen();
Lobby.constructor = Lobby;

Lobby.prototype.render = function() {
	var el = $('<div id="lobby" class="screen">' +
		'<div id="menu"></div>' +
		'<div id="lobby">' +
			'<div id="gamelist" class="list"></div>' +
			'<div id="playerlist" class="list"></div>' +
		'</div>' +
	'</div>');
	var startBtn = new Button("Alusta m&auml;ngu");
	var loginBtn = new Button("Logi sisse");
	var chartBtn = new Button("Edetabel");
	var historyBtn = new Button("Ajalugu");
	el.children("#menu").append(startBtn.render());
	el.children("#menu").append(loginBtn.render());
	el.children("#menu").append(chartBtn.render());
	el.children("#menu").append(historyBtn.render());
	return el;
};