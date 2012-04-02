function WebPlayer(name) {
	this.name = name;
}

WebPlayer.prototype = {
	isRemote: function() {
		return true;
	},

	checkHit: function(coords) {
		// TODO: Get result from server
		return true;
	}
};
