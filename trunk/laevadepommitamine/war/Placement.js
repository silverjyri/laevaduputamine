function Placement() {
	
}
Placement.prototype = new Screen();
Placement.constructor = Placement;

Placement.prototype.getEventShipCoords = function(e, fieldRect) {
	if (e.pageX >= fieldRect.left &&
		e.pageY >= fieldRect.top &&
		e.pageX <= fieldRect.right &&
		e.pageY <= fieldRect.bottom) {
		// Snap to grid
		var x = parseInt((e.pageX - fieldRect.left) / 33);
		var y = parseInt((e.pageY - fieldRect.top) / 33);
		return {x:x, y:y};
	}
	return null;
};

Placement.prototype.render = function() {
	if (this.el) {
		this.endBtn.onRender();
		this.loginBtn.onRender();
		this.chartBtn.onRender();
		this.historyBtn.onRender();
		$.each(this.ships, function(index, value) {
			value.onRender();
		});
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
	
	var onDragMove = function(e) {
		var data = this.dragData;
		var fieldRect = data.fieldRect;
		var clone = data.clone;
		var coords = this.getEventShipCoords(e, fieldRect);
		if (coords) {
			var pos = this.shipContainer.position();
			var newPos = {left: fieldRect.left - pos.left + coords.x * 33,
				top: fieldRect.top - pos.top + coords.y * 33};
			var oldPos = clone.position();
			if (newPos.left != parseInt(oldPos.left) || newPos.top != parseInt(oldPos.top)) {
				this.field.showShipPreview(coords.x, coords.y, clone.length, clone.vertical);
				clone.dragTo(newPos.left, newPos.top);
			}
		} else {
			this.field.clearShipPreview();
			clone.dragBy(e.pageX - data.x, e.pageY - data.y);
		}
	};
	
	var onDrag = function(e, ship) {
		e.preventDefault();
		if (this.shipCounts[ship.length].html() == 0) {
			return false;
		}
		
		var clone = ship.clone();
		var field = $('.field');
		var pl = parseInt(field.css('padding-left')) + 1;
		var pt = parseInt(field.css('padding-top')) + 1;
		var pos = field.offset();
		var fieldRect = {left: pos.left + pl, top: pos.top + pt,
			right: pos.left + field.width(), bottom: pos.top + field.height()};
		this.dragData = {clone: clone, x: e.pageX, y: e.pageY, fieldRect: fieldRect};
		this.shipContainer.append(clone.render());
		this.onDragMoveProxy = $.proxy(onDragMove, this);
		$(document).mousemove(this.dragData, this.onDragMoveProxy);

		return true;
	};
	
	var onDrop = function(e, ship) {
		e.preventDefault();
		$(document).off('mousemove', this.onDragMoveProxy);
		
		var data = this.dragData;
		var clone = data.clone;
		var coords = this.getEventShipCoords(e, data.fieldRect);
		if (coords) {
			var added = this.field.addShip(coords.x, coords.y, clone.length, clone.vertical);
			if (added) {
				var count = this.shipCounts[clone.length].html();
				count--;
				this.shipCounts[clone.length].html(count);
				if (count == 0) {
					this.ships['' + clone.length + 'h'].el.css('opacity', 0.2);
					this.ships['' + clone.length + 'v'].el.css('opacity', 0.2);
				}
			} else {
				//TODO: animate the ship to its original location				
			}
		}
		
		this.field.clearShipPreview();
		clone.el.remove();
		delete this.onDragMoveProxy;
		delete this.dragData;
	};
	
	this.ships = {};
	var s = 10;
	var events = {onDrag: onDrag, onDrop: onDrop, scope: this};
	this.ships['4h'] = new ShipFloating(4, false, $.extend({left: 3*s}, events));
	this.ships['3h'] = new ShipFloating(3, false, $.extend({left: 2*s, top: 32+s}, events));
	this.ships['2h'] = new ShipFloating(2, false, $.extend({left: s, top: 64+2*s}, events));
	this.ships['1h'] = new ShipFloating(1, false, $.extend({top: 96+3*s}, events));
	
	this.ships['4v'] = new ShipFloating(4, true, $.extend({left: 128+3*s, top: 32}, events));
	this.ships['3v'] = new ShipFloating(3, true, $.extend({left: 96+2*s, top: 64+s}, events));
	this.ships['2v'] = new ShipFloating(2, true, $.extend({left: 64+s, top: 96+2*s}, events));
	this.ships['1v'] = new ShipFloating(1, true, $.extend({left: 32, top: 128+3*s}, events));

	this.shipCounts = {};
	this.shipCounts[4] = $('<div class="ship_count" style="left:' + (128+3*s) + 'px;">1</div>');
	this.shipCounts[3] = $('<div class="ship_count" style="left:' + (96+2*s) + 'px; top:' + (32+s) + 'px;">2</div>');
	this.shipCounts[2] = $('<div class="ship_count" style="left:' + (64+s) + 'px; top:' + (64+2*s) + 'px;">3</div>');
	this.shipCounts[1] = $('<div class="ship_count" style="left:32px; top:' + (96+3*s) + 'px;">4</div>');

	var shipContainer = el.children('#ship_container');
	this.shipContainer = shipContainer;
	$.each(this.ships, function(index, value) {
		shipContainer.append(value.render());
	});
	$.each(this.shipCounts, function(index, value) {
		shipContainer.append(value);
	});
	el.append(shipContainer);

	this.field = new Field('1');
	el.append(this.field.render());
	
	this.el = el;
	return el;
};
