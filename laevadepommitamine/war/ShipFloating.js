function ShipFloating(length, vertical, options) {
	if (options) {
	}
	this.length = length;
	this.vertical = vertical;
}

ShipFloating.prototype = {
onRender: function() {
},
render: function() {
	if (this.el) {
		return this.el;
	}
	
	var el = $('<div class="ship_floating"></div>');
	
	if (this.length == 1) {
		el.append('<div class="ship_single"><div>');
	} else {
		if (this.vertical) {
			var i;
			for (i = 0; i < this.length; i++) {
				var ship = $('<div class="box_floating" style="clear:left;"><div>');
				if (i == 0) {
					ship.addClass("ship_vertical_1");
				} else if (i == this.length - 1) {
					ship.addClass("ship_vertical_3");
				} else {
					ship.addClass("ship_vertical_2");
				}
				el.append(ship);
			}
		} else {
			var i;
			for (i = 0; i < this.length; i++) {
				var ship = $('<div class="box_floating"><div>');
				if (i == 0) {
					ship.addClass("ship_horizontal_1");
				} else if (i == this.length - 1) {
					ship.addClass("ship_horizontal_3");
				} else {
					ship.addClass("ship_horizontal_2");
				}
				el.append(ship);
			}
		}
	}
	
	this.el = el;
	this.onRender();
	return el;
}
};
