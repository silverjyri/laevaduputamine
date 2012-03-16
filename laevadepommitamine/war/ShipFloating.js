function ShipFloating(length, vertical, options) {
	if (options) {
		this.left = options.left;
		this.top = options.top;
		this.onDrag = options.onDrag;
		this.onDrop = options.onDrop;
		this.scope = options.scope;
	}
	this.length = length;
	this.vertical = vertical;
	this.left = this.left || 0;
	this.top = this.top || 0;
}

ShipFloating.prototype = {
onMouseUp: function(e) {
	$.proxy(this.onDrop, this.scope)(e, e.data);
	$(document).off('mouseup');
},
onMouseDown: function(e) {
	$.proxy(this.onDrag, this.scope)(e, e.data);

	if (this.onDrop) {
		$(document).mouseup(this, $.proxy(this.onMouseUp, this));
	}
},
onRender: function() {
	if (this.onDrag) {
		this.el.mousedown(this, $.proxy(this.onMouseDown, this));
	}
},
render: function() {
	if (this.el) {
		return this.el;
	}
	
	var el = $('<div class="ship_floating"></div>');
	if (this.left) {
		el.css('left', this.left);
	}
	if (this.top) {
		el.css('top', this.top);
	}
	el.css('width', this.length * 32);
	el.css('height', this.top * 32);
	
	if (this.length == 1) {
		el.append('<div class="box_floating ship_single"><div>');
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
},
clone: function() {
	return new ShipFloating(this.length, this.vertical, {left: this.left, top: this.top});
},
dragBy: function(x, y) {
	this.el.css({left:(x + this.left), top:(y + this.top)});
}
};
