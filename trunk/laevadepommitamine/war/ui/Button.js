function Button(text, options) {
	this.text = text;
	
	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
		this.image = options.image;
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
	if (this.image) {
		var el = $('<img class="button_img" src="' + this.image + '" alt="' + this.text + '" />');
	} else {
		var el = $('<button type="button" class="button">' + this.text + '</button>');
	}

	this.el = el;
	this.onRender();
	return el;
}
};
