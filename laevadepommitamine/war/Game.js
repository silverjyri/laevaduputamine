function Game(ships) {
	this.ships = ships;
	this.player1 = new Player("blabla");
	this.player2 = new AI();
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
		var field = e.data;
		if (e.data === this.field2) {
			var coords = field.getEventCoords(e);
			field.addBomb({x: coords.x, y: coords.y, hit: this.player2.checkHit(coords)});
		}
	}
	
	this.field1 = new FieldView({id: '1', onMouseDown: onMouseDown, scope: this, ships: this.ships});
	this.field2 = new FieldView({id: '2', onMouseDown: onMouseDown, scope: this});
	el.append(this.field1.render());
	el.append(this.field2.render());

	this.el = el;
	return el;
};
