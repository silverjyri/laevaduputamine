function Rankings() {
}

Rankings.prototype = {
	onRender: function() {
		this.menu.onRender();
		Server.getRankingsList();
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
