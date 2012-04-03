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
		el.append('<div class="listitem_text">' + this.text + '</div>');
		this.el = el;
		return el;
	}
};
