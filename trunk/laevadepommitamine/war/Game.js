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
	    	delete Client.game;
	    	delete Client.placement;
	    	Client.startLobby();
	    }}),
	]);
	el.append(this.menu.render());

	var onMouseDown = function(e) {
		if (this.currentPlayer === this.player1) {
			var field = e.data;
			if (e.data === this.field2) {
				var coords = field.getEventCoords(e);
				if (coords) {
					field.addBomb({x: coords.x, y: coords.y, hit: this.player2.checkHit(coords)});
					this.currentPlayer = this.player2;
					this.field1.setStatus('');
					field.setStatus('Ootan vastase k&auml;iku...');
					var scope = this;
					setTimeout(function() {
						var bombCoords = scope.player2.makeMove();
						var hit = scope.player1.checkHit(bombCoords);
						scope.player2.moveResult(bombCoords, hit);
						scope.field1.addBomb({x: bombCoords.x, y: bombCoords.y, hit: hit});
						scope.field1.setStatus('Sinu kord!');
						scope.field2.setStatus('');
						scope.currentPlayer = scope.player1;
					}, 200);
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
