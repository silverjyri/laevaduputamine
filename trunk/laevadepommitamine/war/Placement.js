function Placement(gameId) {
	this.defaultUpdateInterval = 1500;
	this.updateInterval = this.defaultUpdateInterval;
	this.initialized = false;

	if (gameId != undefined) {
		this.isOpponent = true;
		this.opponentHasJoined = false;
		this.gameId = gameId;
		Server.joinGame(gameId, Client.player.name);
	} else {
		this.isOpponent = false;
		Server.createGame(Client.player.name);
	}
}

Placement.prototype = {
	onUpdate : function() {
		Server.getGamePlayers(this.gameId);
		this.updateTimer = setTimeout(this.onUpdate.bind(this),
				this.updateInterval);
	},

	getPlayersCallback : function(players) {
		if (this.isOpponent) {
			if (players[0]) {
				this.webOpponentItem.setText(players[0]);
			}
		} else {
			if (players[1]) {
				this.webOpponentItem.setText(players[1]);
				this.opponentHasJoined = true;
			}
		}
		this.checkReady();
	},

	gameCreated : function(gameId) {
		this.gameId = gameId;

		if (!this.isOpponent) {
			this.onUpdate();
		}
		this.endGameBtn.setEnabled(true);
		this.initialized = true;
	},

	gameJoined : function() {
		Server.getGamePlayers(this.gameId);
		this.endGameBtn.setEnabled(true);
		this.initialized = true;
		this.checkReady();
	},

	onHide : function() {
		if (this.updateTimer) {
			clearTimeout(this.updateTimer);
			delete this.updateTimer;
		}
	},

	onRender : function() {
		this.menu.onRender();
		$.each(this.ships, function(index, value) {
			value.onRender();
		});
		this.field.onRender();
		this.readyBtn.onRender();
		if (this.opponentList) {
			this.opponentList.onRender();
		}

		if (this.initialized && !this.isOpponent) {
			this.onUpdate();
		}
	},

	revertDrag : function() {
		// TODO: animate the ship to its original location
		var data = this.dragData;
		var clone = data.clone;
		var countEl = this.shipCounts[clone.length];

		var count = countEl.html();
		count++;
		countEl.html(count);
		if (count != 0) {
			this.ships['' + clone.length + 'h'].el.css('opacity', '');
			this.ships['' + clone.length + 'v'].el.css('opacity', '');
		}
	},

	placeRandomShips : function() {
		this.field.setShips(Field.generateRandomShips());
		for ( var i = 1; i <= 4; i++) {
			this.shipCounts['' + i].html('0');
		}
		for ( var ship in this.ships) {
			this.ships[ship].el.css('opacity', 0.2);
		}
		this.checkReady();
	},

	checkReady : function() {
		if (!this.initialized || !Field.checkShipsPlaced(Client.player.ships)) {

		} else if (this.opponentList.selected === this.aiOpponentItem) {
			this.readyBtn.setEnabled(true);
			return;
		} else {
			if (this.opponentHasJoined) {
				this.readyBtn.setEnabled(true);
				return;
			}
		}
		this.readyBtn.setEnabled(false);
	},

	render : function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="placement" class="screen"></div>');

		this.endGameBtn = new Button("L&otilde;peta m&auml;ng", {
			disabled : true,
			scope : this,
			fn : function() {
				Client.stopGame();
			}
		});
		this.readyBtn = new Button("Valmis", {
			disabled : true,
			scope : this,
			fn : function() {
				Client.startGame();
			}
		});
		this.menu = new Menu([
		    new Button("Esileht", {
				image : 'img/home.png',
				scope : this,
				fn : function() {
					Client.startLobby();
				}
			}),
			this.endGameBtn,
			new Button("Juhuslik asetus", {
				scope : this,
				fn : this.placeRandomShips
			}),
			this.readyBtn
		]);
		el.append(this.menu.render());

		var adjustDropLocation = function(data, coords) {
			var offset = data.dragOffset;
			var ship = data.clone;
			if (offset) {
				coords.x += offset.x;
				coords.y += offset.y;
			}
			if (ship.vertical) {
				if (coords.y < 0) {
					coords.y = 0;
				} else if (coords.y + ship.length >= 10) {
					coords.y = 10 - ship.length;
				}
			} else {
				if (coords.x < 0) {
					coords.x = 0;
				} else if (coords.x + ship.length >= 10) {
					coords.x = 10 - ship.length;
				}
			}
		};

		var onDragMove = function(e) {
			var data = this.dragData;
			var clone = data.clone;
			var field = this.field;
			var coords = field.getEventCoords(e);
			if (coords) {
				var contPos = this.shipContainer.offset();
				var fieldPos = field.offset();
				adjustDropLocation(data, coords);
				var newPos = {
					left : fieldPos.left - contPos.left + coords.x * 33,
					top : fieldPos.top - contPos.top + coords.y * 33
				};
				var oldPos = clone.position();
				if (newPos.left != parseInt(oldPos.left)
						|| newPos.top != parseInt(oldPos.top)) {
					field.showShipPreview(coords.x, coords.y, clone.length,
							clone.vertical);
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

			var shipPos = ship.el.offset();
			var clone = ship.clone();
			this.dragData = {
				clone : clone,
				x : e.pageX,
				y : e.pageY,
				dragOffset: {
					x: parseInt((shipPos.left - e.pageX) / 32),
					y: parseInt((shipPos.top - e.pageY) / 32),
				}
			};
			this.shipContainer.append(clone.render());
			$(document).mousemove(this.dragData, $.proxy(onDragMove, this));

			var count = this.shipCounts[clone.length].html();
			count--;
			this.shipCounts[clone.length].html(count);
			if (count == 0) {
				this.ships['' + clone.length + 'h'].el.css(
						'opacity', 0.2);
				this.ships['' + clone.length + 'v'].el.css(
						'opacity', 0.2);
			}
			this.checkReady();

			return true;
		};

		var onDrop = function(e, ship) {
			e.preventDefault();
			$(document).off('mousemove', this.onDragMoveProxy);

			var data = this.dragData;
			var clone = data.clone;
			var coords = this.field.getEventCoords(e);
			if (coords) {
				adjustDropLocation(data, coords);
				var added = this.field.addShip({
					x : coords.x,
					y : coords.y,
					length : clone.length,
					vertical : clone.vertical
				});
				if (!added) {
					this.revertDrag();
				}
			} else {
				this.revertDrag();
			}

			this.field.clearShipPreview();
			clone.el.remove();
			delete this.onDragMoveProxy;
			delete this.dragData;
			this.checkReady();
		};

		this.ships = {};
		var s = 10;
		var events = {
			onDrag : onDrag,
			onDrop : onDrop,
			scope : this
		};
		this.ships['4h'] = new ShipFloating(4, false, $.extend({
			left : 3 * s
		}, events));
		this.ships['3h'] = new ShipFloating(3, false, $.extend({
			left : 2 * s,
			top : 32 + s
		}, events));
		this.ships['2h'] = new ShipFloating(2, false, $.extend({
			left : s,
			top : 64 + 2 * s
		}, events));
		this.ships['1h'] = new ShipFloating(1, false, $.extend({
			top : 96 + 3 * s
		}, events));

		this.ships['4v'] = new ShipFloating(4, true, $.extend({
			left : 128 + 3 * s,
			top : 32
		}, events));
		this.ships['3v'] = new ShipFloating(3, true, $.extend({
			left : 96 + 2 * s,
			top : 64 + s
		}, events));
		this.ships['2v'] = new ShipFloating(2, true, $.extend({
			left : 64 + s,
			top : 96 + 2 * s
		}, events));
		this.ships['1v'] = new ShipFloating(1, true, $.extend({
			left : 32,
			top : 128 + 3 * s
		}, events));

		this.shipCounts = {};
		this.shipCounts[4] = $('<div class="ship_count" style="left:'
				+ (128 + 3 * s) + 'px;">1</div>');
		this.shipCounts[3] = $('<div class="ship_count" style="left:'
				+ (96 + 2 * s) + 'px; top:' + (32 + s) + 'px;">2</div>');
		this.shipCounts[2] = $('<div class="ship_count" style="left:'
				+ (64 + s) + 'px; top:' + (64 + 2 * s) + 'px;">3</div>');
		this.shipCounts[1] = $('<div class="ship_count" style="left:32px; top:'
				+ (96 + 3 * s) + 'px;">4</div>');

		var shipContainer = $('<div id="ship_container"></div>');
		this.shipContainer = shipContainer;
		$.each(this.ships, function(index, value) {
			shipContainer.append(value.render());
		});
		$.each(this.shipCounts, function(index, value) {
			shipContainer.append(value);
		});
		this.webOpponentItem = new ListItem({
			text : 'Ootan vastast...',
			image : 'img/webplayer.png'
		});
		if (!this.isOpponent) {
			this.aiOpponentItem = new ListItem({
				text : 'Arvuti',
				image : 'img/aiplayer.png',
				value : -1
			});
		}
		this.opponentList = new ListBox({
			items : (this.isOpponent ? [ this.webOpponentItem ] : [
					this.webOpponentItem, this.aiOpponentItem ]),
			style : {
				position : 'absolute',
				left : 0,
				top : 190,
				width : 190,
				height : 100
			},
			scope : this,
			onSelectionChanged : this.checkReady
		});
		shipContainer.append(this.opponentList.render());
		this.opponentList.select(this.webOpponentItem);
		el.append(shipContainer);

		var onMouseUp = function(e) {
			$.proxy(onDrop, this)(e, this.dragData.ship);
			$(document).off('mouseup', onMouseUp);
		};

		this.field = new FieldView(Client.player, {
			id : 0,
			status: 'Aseta laevad v&auml;ljale',
			scope : this,
			onMouseDown : function(e) {
				if (e.button != 0) {
					return;
				}
				e.preventDefault();
				var field = this.field;
				var coords = field.getEventCoords(e);
				var ship = Field.getShipAtCoords(Client.player.ships, coords);

				if (ship) {
					var contPos = this.shipContainer.offset();
					var fieldPos = field.offset();
					e.pageX = fieldPos.left + ship.x * 33;
					e.pageY = fieldPos.top + ship.y * 33;
					var clone = new ShipFloating(ship.length, ship.vertical, {
						left : e.pageX - contPos.left,
						top : e.pageY - contPos.top
					});
					field.removeShip(ship);
					field.showShipPreview(ship.x, ship.y, clone.length,
							clone.vertical);
					this.dragData = {
						ship : ship,
						clone : clone,
						x : e.pageX,
						y : e.pageY,
						dragOffset : {
							x : ship.x - coords.x,
							y : ship.y - coords.y
						}
					};
					this.shipContainer.append(clone.render());
					$(document).mousemove(this, $.proxy(onDragMove, this));
					$(document).mouseup(this, $.proxy(onMouseUp, this));
				}
			}
		});
		el.append(this.field.render());

		this.el = el;
		return el;
	},
};
