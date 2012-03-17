function Field(id, options) {
	this.id = id;
	this.bombs = {};
	this.ships = {};
	if (options) {
		this.onDrag = options.onDrag;
		this.onDrop = options.onDrop;
		this.scope = options.scope;
		this.startShips = options.ships;
	}
}

Field.prototype = {

// Returns the id of a box. id == 1, getBoxId(3,5) -> 'p1b35'
getBoxId: function(x, y) {
	return 'p' + this.id + 'b' + x + y;
},

// Finds in which box a mouse event took place.
getEventCoords: function(e) {
	var el = this.el;
	var pos = el.offset();
	var pl = parseInt(el.css('padding-left')) + 1;
	var pt = parseInt(el.css('padding-top')) + 1;
	var fieldRect = {left: pos.left + pl, top: pos.top + pt,
		right: pos.left + el.width(), bottom: pos.top + el.height()};
	
	if (e.pageX >= fieldRect.left &&
		e.pageY >= fieldRect.top &&
		e.pageX <= fieldRect.right &&
		e.pageY <= fieldRect.bottom) {
		// Snap to grid
		return {x: parseInt((e.pageX - fieldRect.left) / 33),
				y: parseInt((e.pageY - fieldRect.top) / 33)};
	}
	return null;
},

// Finds a ship at the specified location.
getShipAtCoords: function(coords) {
	var ships = this.ships;
	for (i in ships) {
		var ship = ships[i];
		var sw = ship.vertical ? 1 : ship.length;
		var sh = ship.vertical ? ship.length : 1;
		if ((coords.x >= ship.x) && (coords.x < ship.x + sw) &&
			(coords.y >= ship.y) && (coords.y < ship.y + sh)) {
			return ship;
		}
	}
},

onMouseUp: function(e) {
	$.proxy(this.onDrop, this.scope)(e, e.data);
	$(document).off('mouseup', this.onMouseUp);
},
onMouseDown: function(e) {
	e.preventDefault();
	var coords = this.getEventCoords(e);
	var ship = this.getShipAtCoords(coords);
	
	if (ship && this.onDrag) {
		this.dragData = {x: e.pageX, y: e.pageY, ship: ship};
		$.proxy(this.onDrag, this.scope)(e, this.dragData);
	
		if (this.onDrop) {
			$(document).mouseup(this, $.proxy(this.onMouseUp, this));
		}
	}
},

onRender: function() {
	this.el.mousedown($.proxy(this.onMouseDown, this));

	var ships = this.startShips;
	if (ships) {
		for (i in ships) {
			this.renderShip(ships[i]);
		}
	}
},

render: function() {
	var html = '';
	var x, y;
	for (y = 0; y < 10; y++) {
		html += '<div>';
		for (x = 0; x < 10; x++) {
			html += '<div id="' + this.getBoxId(x,y) + '" class="box"></div>';
		}
		html += '</div>';
	}
	
	var el = $('<div class="field">' + html + '</div>');
	if (this.id) {
		el.attr("id", this.id);
	}

	this.el = el;
	return el;
},

// Returns the screen position of the first box.
offset: function() {
	var el = this.el;
	var offs = el.offset();
	var pl = parseInt(el.css('padding-left')) + 1;
	var pt = parseInt(el.css('padding-top')) + 1;
	return {left: offs.left + pl, top: offs.top + pt}
},

// Checks if a ship can be placed in this field.
verifyShipLocation: function(x, y, length, vertical) {
	if ((vertical ? y : x) + length > 10) {
		return false;
	}

	var ships = this.ships;
	for (i in ships) {
		var ship = ships[i];
		var w = vertical ? 1 : length;
		var h = vertical ? length : 1;
		var sw = ship.vertical ? 1 : ship.length;
		var sh = ship.vertical ? ship.length : 1;
		if ((x + w >= ship.x) && (x <= ship.x + sw) &&
			(y + h >= ship.y) && (y <= ship.y + sh)) {
			return false;
		}
	}
	
	return true;
},

// Colors the background of the ship green or red.
showShipPreview: function(x, y, length, vertical) {
	this.clearShipPreview();
	
	var valid = this.verifyShipLocation(x, y, length, vertical);
	this.preview = {x: x, y: y, length: length, vertical: vertical, valid: valid};
	var validClass = valid ? 'ship_preview_valid' : 'ship_preview_invalid';
	var vp = vertical ? 1 : 0;
	var hp = vertical ? 0 : 1;

	var i;
	for (i = 0; i < length; i++) {
		$('#'+this.getBoxId(x+i*hp, y+i*vp)).addClass(validClass);
	}
},

clearShipPreview: function() {
	var preview = this.preview;
	if (preview) {
		var validClass = preview.valid ? 'ship_preview_valid' : 'ship_preview_invalid';
		var vp = preview.vertical ? 1 : 0;
		var hp = preview.vertical ? 0 : 1;

		var i;
		for (i = 0; i < preview.length; i++) {
			$('#'+this.getBoxId(preview.x+i*hp, preview.y+i*vp)).removeClass(validClass);
		}
		delete this.preview;
	}
},

addShip: function(ship) {
	if (!this.verifyShipLocation(ship.x, ship.y, ship.length, ship.vertical)) {
		return false;
	}
	this.ships['' + ship.x + ship.y] = ship;
	this.renderShip(ship);
	return true;
},

renderShip: function(ship) {
	var x = ship.x;
	var y = ship.y;
	var length = ship.length;
	var vertical = ship.vertical;
	
	if (length == 1) {
		var box = $('#'+this.getBoxId(x, y));
		box.addClass('ship_single');
		return;
	}
	
	var i;
	if (vertical) {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x, y + i));
			if (i == 0) {
				box.addClass('ship_vertical_1');
			} else if (i == length - 1) {
				box.addClass('ship_vertical_3');
			} else {
				box.addClass('ship_vertical_2');
			}
		}
	} else {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x + i, y));
			if (i == 0) {
				box.addClass('ship_horizontal_1');
			} else if (i == length - 1) {
				box.addClass('ship_horizontal_3');
			} else {
				box.addClass('ship_horizontal_2');
			}
		}
	}
},

removeShip: function(x, y) {
	var ship = this.ships['' + x + y];
	var length = ship.length;

	delete this.ships['' + x + y];
	
	if (length == 1) {
		var box = $('#'+this.getBoxId(x, y));
		box.removeClass('ship_single');
		return true;
	}
	
	var i;
	if (ship.vertical) {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x, y + i));
			if (i == 0) {
				box.removeClass('ship_vertical_1');
			} else if (i == length - 1) {
				box.removeClass('ship_vertical_3');
			} else {
				box.removeClass('ship_vertical_2');
			}
		}
	} else {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x + i, y));
			if (i == 0) {
				box.removeClass('ship_horizontal_1');
			} else if (i == length - 1) {
				box.removeClass('ship_horizontal_3');
			} else {
				box.removeClass('ship_horizontal_2');
			}
		}
	}
}
};
