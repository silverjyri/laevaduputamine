function Rankings() {
	this.version = 0;
	this.defaultUpdateInterval = 3000;
	this.updateInterval = this.defaultUpdateInterval;
}

Rankings.prototype = {
	onUpdate: function() {
		Server.getRankingsList();
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
		if (!this.updateTimer) {
			this.onUpdate();
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="rankings" class="screen"></div>');

		this.menu = new Menu([
	  	    new Button("Esileht", {image: 'img/home.png', scope: this, fn: function() {
		    	Client.startLobby();
		    }}),
		]);
		el.append(this.menu.render());

		this.rankingsList = new ListBox();
		el.append(this.rankingsList.render());

		this.el = el;
		return el;
	}
};
