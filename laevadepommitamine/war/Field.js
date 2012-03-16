function Field(id, options) {
	this.id = id;
}
Field.prototype = {
onRender: function() {
},
render: function() {
	var html = '';

	var x, y;
	
	for (x = 0; x < 10; x++) {
		html += '<div>';
		for (y = 0; y < 10; y++) {
			html += '<div id="p' + this.id + 'b' + x + y + '" class="box"></div>';
		}
		html += '</div>';
	}
	
	var el = $('<div class="field">' + html + '</div>');
	if (this.id) {
		el.attr("id", this.id);
	}

	this.el = el;
	this.onRender();
	return el;
}
};
