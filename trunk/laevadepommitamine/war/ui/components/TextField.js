function TextField( options) {
	if (options) {
		this.text = options.text;
		this.fn = options.fn;
		this.scope = options.scope;
		this.style = options.style;
		this.errorText = options.error;
		this.labelText = options.label;
		this.disabled = options.disabled;
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
			this.labelEl = $('<div class="field_label">' + this.labelText + '</div>');
			el.append(this.labelEl);
		}

		var text = this.text ? ('value="' + this.text + '"') : '';
		this.inputEl = $('<input class="field_input" type="text" ' + text + ' />');
		if (this.disabled) {
			this.inputEl.attr('disabled', 'disabled');
		}
		el.append(this.inputEl);

		if (this.errorText) {
			this.errorEl = $('<div class="field_error">' + this.errorText + '</div>');
			el.append(this.errorEl);
		}

		if (this.style) {
			el.css(this.style);
		}

		this.el = el;
		this.onRender();
		return el;
	},

	getText: function() {
		if (this.inputEl) {
			return this.inputEl.val();
		}
		return this.text;
	},
	
	setText: function(text) {
		this.text = text;
		if (this.inputEl) {
			this.inputEl.val(text);
		}
	},

	setEnabled: function(enabled) {
		if (this.disabled == enabled) {
			if (this.inputEl) {
				if (enabled) {
					this.inputEl.removeAttr('disabled');
				} else {
					this.inputEl.attr('disabled', 'disabled');
				}
			}
			this.disabled = !enabled;
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
					this.errorEl = $('<div class="field_error">' + text + '</div>');
					this.el.append(this.errorEl);
				}
			}
		}
	}
};
