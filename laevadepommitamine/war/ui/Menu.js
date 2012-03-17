function Menu(items) {
	this.items = items || [];
}

Menu.prototype = {
onRender: function() {
	for (i in this.items) {
		this.items[i].onRender();
	}
},
render: function() {
	if (this.el) {
		return this.el;
	}
	
	var el = $('<div class="menu"></div>');
	for (i in this.items) {
		el.append(this.items[i].render());
	}
	this.el = el;
	return el;
}
};
