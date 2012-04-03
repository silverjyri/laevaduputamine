function Button(text, options) {
	this.text = text;

	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
		this.image = options.image;
		this.style = options.style;
		this.disabled = options.disabled;
	}
}

Button.prototype = {
	onRender: function() {
		if (this.fn) {
			if (this.scope) {
				this.el.click(this.fn.bind(this.scope));
			} else {
				this.el.click(this.fn);
			}
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el;
		if (this.image) {
			el = $('<img class="button_img" src="' + this.image + '" alt="' + this.text + '" />');
		} else {
			el = $('<button type="button" class="button">' + this.text + '</button>');
		}
		if (this.disabled) {
			el.attr('disabled', 'disabled');
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
	},

	setEnabled: function(enabled) {
		if (this.disabled == enabled) {
			if (this.el) {
				if (enabled) {
					this.el.removeAttr('disabled');
				} else {
					this.el.attr('disabled', 'disabled');
				}
			}
			this.disabled = !enabled;
		}
	}
};
