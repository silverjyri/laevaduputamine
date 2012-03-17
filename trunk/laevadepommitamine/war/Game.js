function Game() {
	
}
Game.prototype = new Screen();
Game.constructor = Game;

Game.prototype.onRender = function() {
	this.endBtn.onRender();
	this.loginBtn.onRender();
	this.chartBtn.onRender();
	this.historyBtn.onRender();
	this.field1.onRender();
	this.field2.onRender();
},

Game.prototype.render = function() {
	if (this.el) {
		return this.el;
	}
	
	var el = $('<div id="placement" class="screen">' +
		'<div id="menu"></div>' +
		'<div id="ship_container"></div>' +
	'</div>');
	
	var menu = el.children("#menu");
	this.endBtn = new Button("L&otilde;peta m&auml;ng", {scope: this, fn: function() {
		Client.startLobby();
	}});
	this.loginBtn = new Button("Logi sisse");
	this.chartBtn = new Button("Edetabel");
	this.historyBtn = new Button("Ajalugu");
	menu.append(this.endBtn.render());
	menu.append(this.loginBtn.render());
	menu.append(this.chartBtn.render());
	menu.append(this.historyBtn.render());
	
	this.field1 = new Field('1');
	this.field2 = new Field('2');
	el.append(this.field1.render());
	el.append(this.field2.render());
	
	this.el = el;
	return el;
};
