function Field(id, options) {
	this.id = id;
	this.ships = {};
	this.bombs = {};
	if (options) {
		this.onDrag = options.onDrag;
		this.onDrop = options.onDrop;
		this.scope = options.scope;
	}
}

Field.prototype = {
getBoxId: function(x, y) {
	return 'p' + this.id + 'b' + x + y;
},

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

onMouseUp: function(e) {
	$.proxy(this.onDrop, this.scope)(e, e.data);
	$(document).off('mouseup', this.onMouseUp);
},
onMouseDown: function(e) {
	var coords = this.getEventCoords(e);
	var ship = this.ships['' + coords.x + coords.y];
	
	if (ship && this.onDrag) {
		var clone = new ShipFloating(ship.length, ship.vertical);
		this.dragData = {clone: clone, x: e.pageX, y: e.pageY};
		$.proxy(this.onDrag, this.scope)(e, this.dragData);
	
		if (this.onDrop) {
			$(document).mouseup(this, $.proxy(this.onMouseUp, this));
		}
	}
},

onRender: function() {
	this.el.mousedown($.proxy(this.onMouseDown, this));
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
	this.onRender();
	return el;
},


offset: function() {
	var el = this.el;
	var offs = el.offset();
	var pl = parseInt(el.css('padding-left')) + 1;
	var pt = parseInt(el.css('padding-top')) + 1;
	return {left: offs.left + pl, top: offs.top + pt}
},

verifyShipLocation: function(x, y, length, vertical) {
	if ((vertical ? y : x) + length > 10) {
		return false;
	}

	var valid = true;
	var ships = this.ships;
	for (i in ships) {
		var ship = ships[i];
		var sx = ship.x;
		var sy = ship.y;
		var w = vertical ? 1 : length;
		var h = vertical ? length : 1;
		var sw = ship.vertical ? 1 : ship.length;
		var sh = ship.vertical ? ship.length : 1;
		if ((x + w >= sx) && (x <= sx + sw) &&
			(y + h >= sy) && (y <= sy + sh)) {
			valid = false;
		}
	}
	
	return valid;
},

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

addShip: function(x, y, length, vertical) {
	if (!this.verifyShipLocation(x, y, length, vertical)) {
		return false;
	}
	var ship = {x:x, y:y, length:length, vertical:vertical};
	this.ships['' + x + y] = ship;

	if (length == 1) {
		var box = $('#'+this.getBoxId(x, y));
		box.addClass('ship_single');
		return true;
	}
	
	var i;
	if (vertical) {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x, y + i));
			if (i == 0) {
				box.addClass("ship_vertical_1");
			} else if (i == length - 1) {
				box.addClass("ship_vertical_3");
			} else {
				box.addClass("ship_vertical_2");
			}
		}
	} else {
		for (i = 0; i < length; i++) {
			var box = $('#'+this.getBoxId(x + i, y));
			if (i == 0) {
				box.addClass("ship_horizontal_1");
			} else if (i == length - 1) {
				box.addClass("ship_horizontal_3");
			} else {
				box.addClass("ship_horizontal_2");
			}
		}
	}
	
	return true;
}
};
