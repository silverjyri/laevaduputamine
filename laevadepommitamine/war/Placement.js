function Placement() {
	
}
Placement.prototype = new Screen();
Placement.constructor = Placement;

Placement.prototype.render = function() {
	if (this.el) {
		this.endBtn.onRender();
		this.loginBtn.onRender();
		this.chartBtn.onRender();
		this.historyBtn.onRender();
		return this.el;
	}
	
	var el = $('<div id="placement" class="screen">' +
		'<div id="menu"></div>' +
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

	this.ship4h1 = new ShipFloating(4, false);
	this.ship4v1 = new ShipFloating(4, true);
	this.ship3v1 = new ShipFloating(3, true);
	this.ship3v2 = new ShipFloating(3, true);
	
	this.shipContainer = $('<div class="ship_container"></div>')
	this.shipContainer.append(this.ship4h1.render());
	this.shipContainer.append(this.ship4v1.render());
	this.shipContainer.append(this.ship3v1.render());
	this.shipContainer.append(this.ship3v2.render());
	el.append(this.shipContainer);
		
	this.p1 = new Field("1");
	el.append(this.p1.render());
	
	this.el = el;
	return el;
};
