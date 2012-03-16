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
	
	var onDrag = function(e, ship) {
		e.preventDefault();
		var clone = ship.clone();
		this.clone = clone;
		var data = {clone: clone, x: e.screenX, y: e.screenY};
		this.shipContainer.append(clone.render());
		$(document).mousemove(data, function(e) {
			e.data.clone.dragBy(e.screenX - data.x, e.screenY - data.y);
		});
	};
	
	var onDrop = function(e, ship) {
		e.preventDefault();
		this.clone.el.remove();
		delete this.clone;
	};
	
	this.ships = {};
	var s = 10;
	this.ships['4h'] = new ShipFloating(4, false, {left: 3*s, onDrag: onDrag, onDrop: onDrop, scope: this});
	this.ships['3h'] = new ShipFloating(3, false, {left: 2*s, top: 32+s});
	this.ships['2h'] = new ShipFloating(2, false, {left: s, top: 64+2*s});
	this.ships['1h'] = new ShipFloating(1, false, {top: 96+3*s});
	
	this.ships['4v'] = new ShipFloating(4, true, {top: 32, left: 128+3*s});
	this.ships['3v'] = new ShipFloating(3, true, {top: 64+s, left: 96+2*s});
	this.ships['2v'] = new ShipFloating(2, true, {top: 96+2*s, left: 64+s});
	this.ships['1v'] = new ShipFloating(1, true, {top: 128+3*s, left: 32});

	this.shipCounts = {};
	this.shipCounts[1] = $('<div class="ship_count" style="left:' + (128+3*s) + 'px;">1</div>');
	this.shipCounts[2] = $('<div class="ship_count" style="left:' + (96+2*s) + 'px; top:' + (32+s) + 'px;">2</div>');
	this.shipCounts[3] = $('<div class="ship_count" style="left:' + (64+s) + 'px; top:' + (64+2*s) + 'px;">3</div>');
	this.shipCounts[4] = $('<div class="ship_count" style="left:32px; top:' + (96+3*s) + 'px;">4</div>');

	var shipContainer = el.children("#ship_container");
	this.shipContainer = shipContainer;
	$.each(this.ships, function(index, value) {
		shipContainer.append(value.render());
	});
	$.each(this.shipCounts, function(index, value) {
		shipContainer.append(value);
	});
	el.append(shipContainer);

	this.p1 = new Field("1");
	el.append(this.p1.render());
	
	this.el = el;
	return el;
};
