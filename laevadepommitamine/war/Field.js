function Field(id, options) {
	this.id = id;
	this.ships = [];
}

Field.prototype = {
getBoxId: function(x, y) {
	return 'p' + this.id + 'b' + x + y;
},
		
onRender: function() {
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

verifyShipLocation: function(x, y, length, vertical) {
	if (vertical) {
		if (y + length > 10) {
			return false;
		}
	} else {
		if (x + length > 10) {
			return false;
		}
	}
	return true;
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
	var ship = {x:y, y:y, length:length, vertical:vertical};
	this.ships[this.ships.length] = ship;

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
