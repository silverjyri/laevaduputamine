function Game(ships) {
	this.player1 = new LocalPlayer("blabla", ships);
	this.player2 = new AIPlayer();
	this.currentPlayer = this.player1;
}
Game.prototype = new Screen();
Game.constructor = Game;

Game.prototype.onRender = function() {
	this.menu.onRender();
	this.field1.onRender();
	this.field2.onRender();
},

Game.prototype.render = function() {
	if (this.el) {
		return this.el;
	}

	var el = $('<div id="placement" class="screen"></div>');

	this.menu = new Menu([
  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
	    	Client.startLobby();
	    }}),
	    new Button("L&otilde;peta m&auml;ng", {scope: this, fn: function() {
	    	Client.stopGame();
	    }}),
	]);
	el.append(this.menu.render());

	var onMouseDown = function(e) {
		if (this.currentPlayer === this.player1) {
			var field = e.data;
			if (e.data === this.field2) {
				var coords = field.getEventCoords(e);
				if (coords) {
					if (field.hasBomb(coords)) {
						return;
					}
					
					var hit = this.player2.checkHit(coords);
					field.addBomb({x: coords.x, y: coords.y, hit: hit});
					if (hit) {
						var fullHit = Field.checkFullHit(this.player2.ships, field.bombs, coords);
						if (fullHit) {
							field.setShipSunk(fullHit);
						}
						return;
					}
					
					this.currentPlayer = this.player2;
					this.field1.setStatus('');
					field.setStatus('Ootan vastase k&auml;iku...');

					var scope = this;
					var enemyMove = function() {
						var bombCoords = scope.player2.makeMove();
						var hit = scope.player1.checkHit(bombCoords);
						scope.player2.moveResult(bombCoords, hit);
						scope.field1.addBomb({x: bombCoords.x, y: bombCoords.y, hit: hit});
						if (hit) {
							var fullHit = Field.checkFullHit(scope.player1.ships, scope.field1.bombs, bombCoords);
							if (fullHit) {
								scope.field1.setShipSunk(fullHit);
							}
							setTimeout(enemyMove, 800);
							return;
						}
						scope.field1.setStatus('Sinu kord!');
						scope.field2.setStatus('');
						scope.currentPlayer = scope.player1;
					};
					
					setTimeout(enemyMove, 400);
				}
			}
		}
	}
	
	this.field1 = new FieldView({id: '1', onMouseDown: onMouseDown, scope: this, ships: this.player1.ships, status: "Sinu kord!"});
	this.field2 = new FieldView({id: '2', onMouseDown: onMouseDown, scope: this});
	el.append(this.field1.render());
	el.append(this.field2.render());

	this.el = el;
	return el;
};
