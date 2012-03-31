function TextField( options) {
	if (options) {
		this.text = options.text;
		this.fn = options.fn;
		this.scope = options.scope;
		this.style = options.style;
		this.errorText = options.error;
		this.labelText = options.label;
	}
}

TextField.prototype = {
	onRender: function() {
		if (this.scope) {
			this.el.keydown($.proxy(this.fn, this.scope));
		} else {
			this.el.keydown(this.fn);
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el = $('<div class="input_field"></div>');
		if (this.labelText) {
			this.labelEl = $('<p class="field_label">' + this.labelText + '</p>');
			el.append(this.labelEl);
		}
		var text = this.text ? ('value="' + this.text + '"') : '';
		this.inputEl = $('<input type="text" ' + text + ' />');
		el.append(this.inputEl);
		if (this.errorText) {
			this.errorEl = $('<p class="field_error">' + this.errorText + '</p>');
			el.append(this.errorEl);
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
		if (this.inputEl) {
			this.inputEl.val(text);
		}
	},

	setError: function(text) {
		this.errorText = text;
		if (this.el) {
			if (!text) {
				if (this.errorEl) {
					this.errorEl.remove();
					delete this.errorEl;
				}
			} else {
				if (this.errorEl) {
					this.errorEl.text(text);
				} else {
					this.errorEl = $('<p class="field_error">' + text + '</p>');
					this.el.append(this.errorEl);
				}
			}
		}
	}
};
