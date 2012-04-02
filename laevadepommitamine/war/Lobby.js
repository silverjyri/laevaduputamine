function Lobby() {
}

Lobby.prototype = {
	onRender: function() {
		this.menu.onRender();

		Server.getGamesList();
		Server.getUniquePlayerName();
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
		  	    	this.username.setError('Nimi juba v&otilde;etud!');
	  	    		Client.startPlacement();
	  	    	}
	  	    }}),
	  	    new Button("Logi sisse"),
	  	    new Button("Edetabel", {fn: function() {
	  	    	Client.startRankings();
	  	    }}),
	  	    new Button("Ajalugu")
	  	]);
	  	el.append(this.menu.render());

	  	var username = new TextField({label: 'Nimi:', fn: function(e) {
	  		if (e.keyCode == 13) {
	  			this.username.setError('Nimi juba v&otilde;etud!');
	  		}
	  	}, scope: this});
	  	this.username = username;
	  	el.append(username.render());
	  	
		var gamesList = new ListBox();
		this.gamesList = gamesList;
		el.append(gamesList.render());

		this.el = el;
		return el;
	},

	addGame: function(name) {
		var item = new ListItem({text: name, image: 'img/game.png'});
		this.gamesList.add(item);
	}
};
