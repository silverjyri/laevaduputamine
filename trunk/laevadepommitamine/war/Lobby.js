function Lobby() {
}

Lobby.prototype = {
	onRender: function() {
		this.menu.onRender();
	},

	render: function() {
		if (this.el) {
			if (Client.placement) {
				this.menu.items[1].setText("Tagasi m&auml;ngu");
			} else {
				this.menu.items[1].setText("Alusta m&auml;ngu");
			}
			return this.el;
		}

		var el = $('<div id="lobby" class="screen"></div>');

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png'}),
	  	    new Button(Client.placement ? "Tagasi m&auml;ngu" : "Alusta m&auml;ngu",
	  	    	{scope: this, fn: function() {
	  	    	if (Client.game) {
	  	    		Client.startGame();
	  	    	} else {
	  	  	    	Client.startPlacement();
	  	    	}
	  	    }}),
	  	    new Button("Logi sisse"),
	  	    new Button("Edetabel"),
	  	    new Button("Ajalugu")
	  	]);
	  	el.append(this.menu.render());

		var lists = $('<div id="lists"></div>');
		var gamesList = new ListBox();
		window.getGamesList();
		this.gamesList = gamesList;
		var playersList = new ListBox();
		lists.append(gamesList.render());
		lists.append(playersList.render());
		el.append(lists);

		this.el = el;
		return el;
	},
};
