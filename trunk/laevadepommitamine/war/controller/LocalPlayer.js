function LocalPlayer(name, ships) {
	this.name = name;
	this.ships = ships;
}

LocalPlayer.prototype = {
checkHit: function(coords) {
	return Field.checkHit(this.ships, coords);
}
};
