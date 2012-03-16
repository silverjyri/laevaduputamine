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
	$(document).off('mouseup', this.onMouseUp);
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
	
	if (this.vertical) {
		el.css({width: 32, height: this.length * 32});
	} else {
		el.css({width: this.length * 32, height: 32});
	}
	
	if (this.length == 1) {
		el.append('<div class="box_floating ship_single"><div>');
	} else {
		var i;
		if (this.vertical) {
			for (i = 0; i < this.length; i++) {
				var box = $('<div class="box_floating" style="clear:left;"><div>');
				if (i == 0) {
					box.addClass("ship_vertical_1");
				} else if (i == this.length - 1) {
					box.addClass("ship_vertical_3");
				} else {
					box.addClass("ship_vertical_2");
				}
				el.append(box);
			}
		} else {
			for (i = 0; i < this.length; i++) {
				var box = $('<div class="box_floating"><div>');
				if (i == 0) {
					box.addClass("ship_horizontal_1");
				} else if (i == this.length - 1) {
					box.addClass("ship_horizontal_3");
				} else {
					box.addClass("ship_horizontal_2");
				}
				el.append(box);
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

dragTo: function(x, y) {
	this.el.css({left:x, top:y});
},
dragBy: function(x, y) {
	this.dragTo(x+this.left, y+this.top);
},

position: function() {
	if(this.el) {
		return {left: this.el.css('left'), top: this.el.css('top')};
	}
	return {left: this.left, top: this.top};
}
};
