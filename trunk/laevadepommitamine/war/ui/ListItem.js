function ListItem(options) {
	if (options) {
		this.id = options.id;
		this.text = options.text;
	}
}

ListItem.prototype = {
render: function() {
	var el = $('<div class="listitem"></div>');
	if (this.id) {
		el.attr("id", this.id);
	}
	el.append(this.text);
	this.el = el;
	return el;
}
};
