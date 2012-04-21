function History() {
	this.version = 0;
	this.defaultUpdateInterval = 3000;
	this.updateInterval = this.defaultUpdateInterval;
}

History.prototype = {
	onUpdate: function() {
		Server.getFinishedGamesList();
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
		this.replayBtn.onRender();
		if (!this.updateTimer) {
			this.onUpdate();
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="history" class="screen"></div>');

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
		    	Client.startLobby();
		    }}),
		]);
		el.append(this.menu.render());

		this.replayBtn = new Button("M&auml;ngi ette", {disabled: true, scope: this, fn: function() {
			Client.startReplay(this.gamesList.selected.value);
		}});
		el.append(this.replayBtn.render());

		this.gamesList = new ListBox({scope: this, onSelectionChanged: function(selected) {
			this.replayBtn.setEnabled(!!selected);
		}});
		el.append(this.gamesList.render());

		this.el = el;
		return el;
	},

	addGame: function(id, name, select) {
		var item = new ListItem({value: id, text: name, image: 'img/game.png'});
		this.gamesList.add(item);
		if (select) {
			this.gamesList.select(item);
		}
	}
};
