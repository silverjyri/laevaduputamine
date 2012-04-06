function LocalPlayer(name) {
	this.name = name;
	this.ships = {};
	this.bombs = {};
}

LocalPlayer.prototype = {
	checkHit: function(coords) {
		return Field.checkHit(this.ships, coords);
	},

	makeMove: function() {
	}
};
