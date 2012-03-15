function Button(text, options) {
	this.text = text;
	
	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
	}
}

Button.prototype = {
render: function() {
	var el = $('<button type="button" class="button">' + this.text + '</button>');
	if (this.scope) {
		el.click($.proxy(this.fn, this.scope));
	} else {
		el.click(this.fn);
	}
	return el;
}
};
