function ListBox(options) {
	if (options) {
		this.id = options.id;
		this.items = options.items || [];
	}
	this.items = this.items || [];
}

ListBox.prototype = {
render: function() {
	var el = $('<div class="list"></list>');
	if (this.id) {
		el.attr("id", this.id);
	}
	this.el = el;
	
	$.each(this.items, function(i, val) {
		el.append('<div class="listitem">' + val + '</div>');
	})
	
	return el;
},
add: function(item) {
	this.items[this.items.length] = item;
	
	if (this.el) {
		this.el.append(item);
	}
}
};
