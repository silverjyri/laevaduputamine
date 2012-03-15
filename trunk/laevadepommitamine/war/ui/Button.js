function Button(text) {
	this.text = text;
}

Button.prototype = {
render: function() {
	return '<button type="button" class="button">' + this.text + '</button>';
}
};
