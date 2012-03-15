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
	
	var items = this.items;
	$.each(this.items, function(i, val) {
		if (!(val instanceof ListItem)) {
			val = new ListItem({text: val});
			items[i] = val;
		}
		el.append(val.render());
	});
	
	return el;
},
add: function(item) {
	this.items[this.items.length] = item;
	
	if (this.el) {
		this.el.append(item);
	}
},
remove: function(item) {
	var item = item;
	var itemText = (item instanceof ListItem) ? item.text : item;
	
	this.items = jQuery.grep(this.items, function(value) {
		if (value.text === itemText) {
			item = value;
			return false;
		}
		return true;
	});

	if (this.el && item instanceof ListItem) {
		item.el.remove();
	}
}
};
