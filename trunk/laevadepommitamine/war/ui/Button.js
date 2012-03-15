function Button(text, options) {
	this.text = text;
	
	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
	}
}

Button.prototype = {
onRender: function() {
	if (this.scope) {
		this.el.click($.proxy(this.fn, this.scope));
	} else {
		this.el.click(this.fn);
	}
},
render: function() {
	var el = $('<button type="button" class="button">' + this.text + '</button>');
	this.el = el;
	this.onRender();
	return el;
}
};
