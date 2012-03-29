function TextField( options) {
	if (options) {
		this.text = text;
		this.fn = options.fn;
		this.scope = options.scope;
		this.style = options.style;
	}
}

TextField.prototype = {
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

		var el = $('<div class="input_field"></div>');
		var text = this.text ? ('value="' + this.text + '"') : '';
		var inputEl = $('<input type="text" ' + text + ' />');
		var errorEl = $('<p class="field_error">Nimi on juba v&otilde;etud!</p>');
		el.append(inputEl);
		el.append(errorEl);

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
