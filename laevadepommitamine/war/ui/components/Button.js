function Button(text, options) {
	this.text = text;

	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
		this.image = options.image;
		this.style = options.style;
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
		if (this.el) {
			return this.el;
		}

		if (this.image) {
			var el = $('<img class="button_img" src="' + this.image + '" alt="' + this.text + '" />');
		} else {
			var el = $('<button type="button" class="button">' + this.text + '</button>');
		}

		if (this.style) {
			el.css(this.style);
		}

		this.el = el;
		this.onRender();
		return el;
	},

	setText: function(text) {
		this.text = text;
		if (this.el) {
			this.el.html(text);
		}
	}
};
