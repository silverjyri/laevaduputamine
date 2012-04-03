function Rankings() {
	this.version = 0;
}

Rankings.prototype = {
	onUpdate: function() {
		Server.getRankingsList();
	},

	onHide: function() {
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
			delete this.updateTimer;
		}
	},

	onRender: function() {
		this.menu.onRender();
		if (!this.updateTimer) {
			this.onUpdate();
			this.updateTimer = setInterval(this.onUpdate.bind(this), 2000);
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div id="placement" class="screen"></div>');

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
	},
};
