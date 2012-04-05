function FieldView(options) {
	this.bombs = {};
	this.ships = {};
	if (options) {
		this.id = options.id;
		this.onMouseDown = options.onMouseDown;
		this.onDrop = options.onDrop;
		this.scope = options.scope;
		this.startShips = options.ships;
		this.status = options.status;
	}
	this.status = this.status || '';
}

FieldView.prototype = {
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

	onRender: function() {
		if (this.onMouseDown) {
			this.el.mousedown(this, this.onMouseDown.bind(this.scope || this));
		}
	
		var ships = this.startShips;
		if (ships) {
			for (var i in ships) {
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

		if (this.id) {
			if (this.id === '1') {
				el.append('<div class="name">M&auml;ngija: ' + Client.game.player1.name + '</div>');
			} else {
				el.append('<div class="name">M&auml;ngija: ' + Client.game.player2.name + '</div>');
			}
			el.append('<div class="status_text">' + this.status + '</div>');
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

	// Colors the background of the ship green or red.
	showShipPreview: function(x, y, length, vertical) {
		this.clearShipPreview();

		this.preview = {x: x, y: y, length: length, vertical: vertical};
		var valid = Field.checkLocation(this.ships, this.preview);
		this.preview.valid = valid;
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
		if (!Field.checkLocation(this.ships, ship)) {
			return false;
		}
		this.ships['' + ship.x + ship.y] = ship;
		this.renderShip(ship, true);
		return true;
	},

	clearBox: function(box) {
		this.clearAnim(box);
		box.html('');
	},

	clearAnim: function(box) {
		box.removeClass('addAnimation');
		box.removeClass('explosionAnimation');
	},

	setAnimAdd: function(box) {
		box.addClass('addAnimation');
	},

	setAnimExplosion: function(box) {
		box.addClass('explosionAnimation');
	},

	renderShip: function(ship, animate) {
		var x = ship.x;
		var y = ship.y;
		var length = ship.length;
		var vertical = ship.vertical;

		if (length == 1) {
			var box = $('#'+this.getBoxId(x, y));
			box.html('');
			var shipLayer = $('<div class="ship_layer"></div>');
			box.append(shipLayer);
			shipLayer.addClass('ship_single');
			if (animate) {
				this.setAnimAdd(box);
			}
			return;
		}

		var i;
		if (vertical) {
			for (i = 0; i < length; i++) {
				var box = $('#'+this.getBoxId(x, y + i));
				box.html('');
				var shipLayer = $('<div class="ship_layer"></div>');
				box.append(shipLayer);
				if (animate) {
					this.setAnimAdd(box);
				}
				if (i == 0) {
					shipLayer.addClass('ship_vertical_1');
				} else if (i == length - 1) {
					shipLayer.addClass('ship_vertical_3');
				} else {
					shipLayer.addClass('ship_vertical_2');
				}
			}
		} else {
			for (i = 0; i < length; i++) {
				var box = $('#'+this.getBoxId(x + i, y));
				box.html('');
				var shipLayer = $('<div class="ship_layer"></div>');
				box.append(shipLayer);
				if (animate) {
					this.setAnimAdd(box);
				}
				if (i == 0) {
					shipLayer.addClass('ship_horizontal_1');
				} else if (i == length - 1) {
					shipLayer.addClass('ship_horizontal_3');
				} else {
					shipLayer.addClass('ship_horizontal_2');
				}
			}
		}
	},

	setShipSunk: function(ship) {
		var x = ship.x;
		var y = ship.y;
		var vp = ship.vertical ? 1 : 0;
		var hp = ship.vertical ? 0 : 1;

		var i, el;
		for (i = 0; i < ship.length; i++) {
			el = $('#'+this.getBoxId(x+i*hp, y+i*vp));
			var bombLayer = el.children('.bomb_layer');
			bombLayer.removeClass('bomb');
			bombLayer.addClass('sunk');
			el.children('.ship_layer').remove();
		}
	},

	removeShip: function(coords) {
		var x = coords.x;
		var y = coords.y;
		var ship = this.ships['' + x + y];
		var length = ship.length;

		delete this.ships['' + x + y];

		if (length == 1) {
			var box = $('#'+this.getBoxId(x, y));
			this.clearBox(box);
			return true;
		}

		var i;
		if (ship.vertical) {
			for (i = 0; i < length; i++) {
				var box = $('#'+this.getBoxId(x, y + i));
				this.clearBox(box);
			}
		} else {
			for (i = 0; i < length; i++) {
				var box = $('#'+this.getBoxId(x + i, y));
				this.clearBox(box);
			}
		}
	},

	hasBomb: function(coords) {
		return !!this.bombs['' + coords.x + coords.y];
	},

	addBomb: function(bomb) {
		this.bombs['' + bomb.x + bomb.y] = bomb;
		this.renderBomb(bomb);
	},

	renderBomb: function(bomb) {
		var box = $('#'+this.getBoxId(bomb.x, bomb.y));
		var bombLayer = $('<div class="bomb_layer"></div>');
		box.append(bombLayer);
		this.setAnimExplosion(box);
		if (bomb.hit) {
			bombLayer.addClass('bomb');
		} else {
			bombLayer.addClass('empty');
		}
	},

	setStatus: function(text) {
		if (this.el) {
			this.el.children('.status_text').html(text);
		}
		this.status = text;
	}
};
