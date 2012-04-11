function ListItem(options) {
	if (options) {
		this.id = options.id;
		this.text = options.text;
		this.image = options.image;
		this.value = options.value;
	}
}

ListItem.prototype = {
	render: function() {
		var el = $('<div class="listitem"></div>');
		if (this.id) {
			el.attr("id", this.id);
		}
		if (this.image) {
			el.append('<img class="button_img" src="' + this.image + '" alt="' + this.text + '" />');
		}
		this.textEl = $('<div class="listitem_text">' + this.text + '</div>');
		el.append(this.textEl);
		this.el = el;
		return el;
	},

	setText: function(text) {
		this.text = text;
		if (this.textEl) {
			this.textEl.html(text);
		}
	}
};
