function Button(text, options) {
	this.text = text;

	if (options) {
		this.fn = options.fn;
		this.scope = options.scope;
		this.image = options.image;
		this.style = options.style;
		this.disabled = options.disabled;
	}

	this.disabled = !!this.disabled;
	if (this.fn && this.scope) {
		this.fn = this.fn.bind(this.scope);
	}
}

Button.prototype = {
	onRender: function() {
		if (this.fn) {
			if (this.image && this.disabled) {
				return;
			}
			this.el.click(this.fn);
		}
	},

	render: function() {
		if (this.el) {
			return this.el;
		}

		var el;
		if (this.image) {
			el = $('<img class="button_img" src="' + this.image + '" title="' + this.text + '" alt="' + this.text + '" />');
			if (this.disabled) {
				el.addClass('button_img_disabled');
			}
		} else {
			el = $('<button type="button" class="button">' + this.text + '</button>');
			if (this.disabled) {
				el.attr('disabled', 'disabled');
			}
		}

		if (this.style) {
			el.css(this.style);
		}

		this.el = el;
		return el;
	},

	setText: function(text) {
		this.text = text;
		if (this.el) {
			this.el.html(text);
		}
	},

	setImage: function(image) {
		if (this.image != image) {
			if (this.el) {
				this.el.attr('src', image);
			}
			this.image = image;
		}
	},

	setEnabled: function(enabled) {
		if (this.disabled == enabled) {
			if (this.el) {
				if (enabled) {
					if (this.image) {
						this.el.removeClass('button_img_disabled');
						this.el.click(this.fn);
					} else {
						this.el.removeAttr('disabled');
					}
				} else {
					if (this.image) {
						this.el.addClass('button_img_disabled');
						this.el.off('click', this.fn);
						
					} else {
						this.el.attr('disabled', 'disabled');
					}
					
				}
			}
			this.disabled = !enabled;
		}
	}
};
