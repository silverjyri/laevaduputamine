function Button(text, options) {
	this.text = text;
	
	if (options) {
		this.fn = options.fn;
	}
}

Button.prototype = {
render: function() {
	var el = $('<button type="button" class="button">' + this.text + '</button>');
	el.click(this.fn);
	return el;
}
};
