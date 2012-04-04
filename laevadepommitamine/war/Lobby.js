function Lobby() {
}

Lobby.prototype = {
	onRender: function() {
		this.menu.onRender();
		this.gamesList.onRender();
		if (this.joinBtn) {
			this.joinBtn.onRender();
		}

		Server.getGamesList();
		if (!this.initialized) {
			Server.getUniquePlayerName();
		}
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
		  	    	//this.username.setError('Nimi juba v&otilde;etud!');
	  	    		delete this.joinGame;
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

	  	var username = new TextField({label: 'Nimi:', disabled: true, fn: function(e) {
	  		if (e.keyCode == 13) {
	  			this.username.setError('Nimi juba v&otilde;etud!');
	  		}
	  	}, scope: this});
	  	this.username = username;
	  	el.append(username.render());
	  	
		var gamesList = new ListBox({scope: this, onSelectionChanged: function(selected) {
			if (!this.joinBtn) {
				this.joinBtn = new Button("Liitu m&auml;nguga", {scope: this, fn: function() {
					this.joinGame = selected.value;
					Client.startPlacement();
				}});
				var joinBtnEl = this.joinBtn.render()
				joinBtnEl.css('float', 'left');
				this.el.append(joinBtnEl);
			}
		}});
		this.gamesList = gamesList;
		el.append(gamesList.render());

		this.loadingGif = $('<img src="img/loading.gif" />');
		el.append(this.loadingGif);
		
		this.el = el;
		return el;
	},

	addGame: function(id, name, select) {
		var item = new ListItem({value: id, text: name, image: 'img/game.png'});
		this.gamesList.add(item);
		if (select) {
			this.gamesList.select(item);
		}
	},

	initialize: function(playerName) {
		this.username.setText(playerName);
		this.username.setEnabled(true);
		this.loadingGif.remove();
		this.initialized = true;
	}
};
