function Game(ships) {
	this.ships = ships;
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
	    	Client.startLobby();
	    }}),
	    new Button("Edetabel"),
	    new Button("Ajalugu")
	]);
	el.append(this.menu.render());

	this.field1 = new Field('1', {ships: this.ships});
	this.field2 = new Field('2');
	el.append(this.field1.render());
	el.append(this.field2.render());

	this.el = el;
	return el;
};
