function Placement() {
	
}
Placement.prototype = new Screen();
Placement.constructor = Placement;

Placement.prototype.onRender = function() {
	this.menu.onRender();
	$.each(this.ships, function(index, value) {
		value.onRender();
	});
	this.field.onRender();
	this.readyBtn.onRender();
},

Placement.prototype.revertDrag = function() {
	var data = this.dragData;
	var clone = data.clone;
	if (data.existing) {
		var count = this.shipCounts[clone.length].html();
		count++;
		this.shipCounts[clone.length].html(count);
		if (count != 0) {
			this.ships['' + clone.length + 'h'].el.css('opacity', '');
			this.ships['' + clone.length + 'v'].el.css('opacity', '');
		}
	}
},

Placement.prototype.render = function() {
	if (this.el) {
		return this.el;
	}

	var el = $('<div id="placement" class="screen"></div>');

	this.menu = new Menu([
	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
	    	Client.startLobby();
	    }}),
	    new Button("L&otilde;peta m&auml;ng", {scope: this, fn: function() {
	    	delete Client.game;
	    	delete Client.placement;
	    	Client.startLobby();
	    }}),
	    new Button("Logi sisse"),
	    new Button("Edetabel"),
	    new Button("Ajalugu")
	]);
	el.append(this.menu.render());

	var onDragMove = function(e) {
		var data = this.dragData;
		var clone = data.clone;
		var field = this.field;
		var coords = field.getEventCoords(e);
		if (coords) {
			var contPos = this.shipContainer.offset();
			var fieldPos = field.offset();
			var newPos = {left: fieldPos.left - contPos.left + coords.x * 33,
				top: fieldPos.top - contPos.top + coords.y * 33};
			var oldPos = clone.position();
			if (newPos.left != parseInt(oldPos.left) || newPos.top != parseInt(oldPos.top)) {
				field.showShipPreview(coords.x, coords.y, clone.length, clone.vertical);
				clone.dragTo(newPos.left, newPos.top);
			}
		} else {
			field.clearShipPreview();
			clone.dragBy(e.pageX - data.x, e.pageY - data.y);
		}
	};
	
	var onDrag = function(e, ship) {
		e.preventDefault();
		if (this.shipCounts[ship.length].html() == 0) {
			return false;
		}
		
		var clone = ship.clone();
		this.dragData = {clone: clone, x: e.pageX, y: e.pageY};
		this.shipContainer.append(clone.render());
		$(document).mousemove(this.dragData, $.proxy(onDragMove, this));

		return true;
	};
	
	var onDrop = function(e, ship) {
		e.preventDefault();
		$(document).off('mousemove', this.onDragMoveProxy);
		
		var data = this.dragData;
		var clone = data.clone;
		var coords = this.field.getEventCoords(e);
		if (coords) {
			var added = this.field.addShip(
				{x: coords.x, y: coords.y, length: clone.length, vertical: clone.vertical});
			if (added) {
				if (!data.existing) {
					var count = this.shipCounts[clone.length].html();
					count--;
					this.shipCounts[clone.length].html(count);
					if (count == 0) {
						this.ships['' + clone.length + 'h'].el.css('opacity', 0.2);
						this.ships['' + clone.length + 'v'].el.css('opacity', 0.2);
					}
				}
			} else {
				this.revertDrag();
				//TODO: animate the ship to its original location				
			}
		} else {
			this.revertDrag();
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

	var shipContainer = $('<div id="ship_container"></div>');
	this.shipContainer = shipContainer;
	$.each(this.ships, function(index, value) {
		shipContainer.append(value.render());
	});
	$.each(this.shipCounts, function(index, value) {
		shipContainer.append(value);
	});
	this.readyBtn = new Button("Valmis", {scope: this, fn: function() {
		Client.startGame(this.field.ships);
	}, style: {position: 'absolute', left: 90, top: 200}});
	shipContainer.append(this.readyBtn.render());
	el.append(shipContainer);
	
	var onMouseUp = function(e) {
		$.proxy(onDrop, this)(e, this.dragData.ship);
		$(document).off('mouseup', onMouseUp);
	};
	
	var onExistingDrag = function(e) {
		var field = this.field;
		var coords = field.getEventCoords(e);
		var ship = field.getShipAtCoords(coords);

		if (ship) {
			var contPos = this.shipContainer.offset();
			var clone = new ShipFloating(ship.length, ship.vertical, {left: e.pageX - contPos.left, top: e.pageY - contPos.top});
			field.removeShip(ship);
			this.dragData = {ship: ship, clone: clone, x: e.pageX, y: e.pageY, existing: true};
			this.shipContainer.append(clone.render());
			$(document).mousemove(this, $.proxy(onDragMove, this));
			$(document).mouseup(this, $.proxy(onMouseUp, this));
		}
	}
	
	this.field = new Field('0', {onMouseDown: onExistingDrag, scope: this});
	el.append(this.field.render());
	
	this.el = el;
	return el;
};
