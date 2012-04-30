function Lobby() {
	this.gamesListVersion = 0;
	this.defaultUpdateInterval = 1500;
	this.updateInterval = this.defaultUpdateInterval;
}

Lobby.prototype = {
	onUpdate: function() {
		Server.getActiveGamesList();
		this.updateTimer = setTimeout(this.onUpdate.bind(this), this.updateInterval);
	},

	onHide: function() {
		if (this.updateTimer) {
			clearTimeout(this.updateTimer);
			delete this.updateTimer;
		}
	},

	onRender: function() {
		this.menu.onRender();
		this.username.onRender();
		this.gamesList.onRender();
		this.joinBtn.onRender();

		if (!this.updateTimer) {
			this.onUpdate();
		}

		if (!this.initialized) {
			Server.getUniquePlayerName();
		}
	},

	render: function() {
		if (this.el) {
			if (Client.placement || Client.game) {
				this.menu.items[1].setText("Tagasi m&auml;ngu");
			} else {
				this.menu.items[1].setText("Alusta m&auml;ngu");
			}
			return this.el;
		}

		var el = $('<div id="lobby" class="screen"></div>');

		this.gameBtn = new Button(Client.placement ? "Tagasi m&auml;ngu" : "Alusta m&auml;ngu",
  	    	{disabled: true,
			scope: this, fn: function() {
  	    	if (Client.game) {
  	    		Client.startGame();
  	    	} else {
	  	    	//this.username.setError('Nimi juba v&otilde;etud!');
  	    		Client.startPlacement();
  	    	}
  	    	if (this.joinBtn) {
  	    		this.joinBtn.setEnabled(false);
  	    	}
  	    }});
		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png'}),
	  	    this.gameBtn,
	  	    new Button("Logi sisse", {disabled: true}),
	  	    new Button("Edetabel", {fn: function() {
	  	    	Client.startRankings();
	  	    }}),
	  	    new Button("Ajalugu", {fn: function() {
	  	    	Client.startHistory();
	  	    }}),
	  	]);
	  	el.append(this.menu.render());

	  	var username = new TextField({label: 'Nimi:', disabled: true, keyup: function(e) {
	  		var nameOk = false;
	  		if (e.keyCode == 13) {
	  			//this.username.setError('Nimi juba v&otilde;etud!');
	  		}
	  		if (this.username.getText() != '') {
	  			nameOk = true;
	  		}
	  		this.gameBtn.setEnabled(nameOk);
	  		
	  	}, scope: this});
	  	this.username = username;
	  	el.append(username.render());

		this.loadingGif = $('<img src="img/loading.gif" />');
		el.append(this.loadingGif);
	  	el.append($('<div style="float: right; padding-right: 195px;" class="fb-login-button">Logi sisse</div>'));
	  	
		var gamesList = new ListBox({scope: this, onSelectionChanged: function(selected) {
			this.joinBtn.setEnabled(!!selected && !(Client.placement || Client.game));
		}});
		this.gamesList = gamesList;
		el.append(gamesList.render());

		this.joinBtn = new Button("Liitu m&auml;nguga", {disabled: true, scope: this, fn: function() {
			this.joinBtn.setEnabled(false);
			Client.gameId = this.gamesList.selected.value;
			Client.startPlacement();
		}});
		var joinBtnEl = this.joinBtn.render()
		joinBtnEl.css('float', 'left');
		el.append(joinBtnEl);

	
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
		this.gameBtn.setEnabled(true);
		this.loadingGif.remove();
		delete this.loadingGif;
		this.initialized = true;
	}
};
