function ListBox(options) {
	if (options) {
		this.id = options.id;
		this.onSelectionChanged = options.onSelectionChanged;
		this.scope = options.scope;
		this.items = options.items;
		this.style = options.style;
	}
	this.items = this.items || [];

	$.each(this.items, function(i, item) {
		item = this.convertItem(item);
		item.parent = this;
	}.bind(this));

	if (this.onSelectionChanged && this.scope) {
		this.onSelectionChanged = this.onSelectionChanged.bind(this.scope);
	}
}

ListBox.prototype = {
	select: function(item) {
		if (this.selected && (this.selected !== item)) {
			this.selected.el.removeClass('listitem_selected');
		}
		if (item) {
			item.el.addClass('listitem_selected');
			this.selected = item;
		} else {
			delete this.selected;
		}
		if (this.onSelectionChanged) {
			this.onSelectionChanged(item);
		}
	},

	onClick: function(e) {
		var item = this;
		var listbox = item.parent;

		listbox.select(item);
	},

	onRender: function() {
		var me = this;
		$.each(this.items, function(i, item) {
			item.el.click(me.onClick.bind(item));
		});
	},

	render: function() {
		var el = $('<div class="list"></list>');
		if (this.id) {
			el.attr("id", this.id);
		}
		this.el = el;

		var items = this.items;
		$.each(this.items, function(i, item) {
			el.append(item.render());
		});

		if (this.style) {
			el.css(this.style);
		}

		return el;
	},

	convertItem: function(item) {
		if (Client.isString(item)) {
			item = new ListItem({text: item});
		}
		return item;
	},

	add: function(item) {
		item = this.convertItem(item);
		item.parent = this;
		this.items[this.items.length] = item;

		if (this.el) {
			this.el.append(item.render());
			if (item.el) {
				item.el.click(this.onClick.bind(item));
			}
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
			delete item.parent;
		}
	},

	clear: function() {
		this.items = [];
		this.select(null);
		if (this.el) {
			this.el.html('');
		}
	}
};
