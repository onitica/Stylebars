//global variables for bars
var StyleBars = (function() {
	var callback_array = [];
	
	var defaults = {
		bar_margin : 10,
		image_empty_path : "images/emptystylebar.jpg",
		image_full_path : "images/fullstylebar.jpg",
		type : "full-square",
		selection_type : "all",
		selectable : undefined,
		selected : 0,
		total : 10,
		size : 15,
		counter : undefined,
		callback : undefined
	}

	function full_strings(type) {
		switch(type) {
			case "circle" :
				return "full-circle";
			case "image" :
				return "full-image";
			default: 
				return "full-square";
		}
	}

	function empty_strings(type) {
		switch(type) {
			case "circle" :
				return "empty-circle";
			case "image" :
				return "empty-image";
			default: 
				return "empty-square";
		}
	}
	
	function get_stylebar(name, params) {
		var args = $.extend({}, defaults, params);
		var outerDiv = $(document.createElement('div'));
		outerDiv.attr("class", "bar");
		outerDiv.attr("id", name);
		outerDiv.attr("numSelected", args.selected);
		outerDiv.attr("type", args.type);
		outerDiv.attr("itemSize", args.size);
		outerDiv.attr("barItemMargin", args.bar_margin);
		outerDiv.attr("totalNum", args.total);
		outerDiv.attr("dynamic", args.selectable);
		outerDiv.attr("selectionType", args.selection_type);
		outerDiv.attr("numSelected", args.selected - 1)
		if(!(args.callback == null)) {
			callback_array[name] = args.callback;
		}
		if(!(args.counter == null)) {
			outerDiv.on("counterEvent", function(e, value) {
				args.counter(value);
			});
		}
		if(args.type === "image") {
			outerDiv.attr("fullimgpath", args.image_full_path);
			outerDiv.attr("emptyimgpath", args.image_empty_path);
		}
		
		//generate div
		var divArray = new Array(args.total);
		for(var i = 0; i < args.total; i++) {
			if(args.type === "image") {
				divArray[i] = $(document.createElement('img'));
			} else {
				divArray[i] = $(document.createElement('div'));
			}
			divArray[i].attr("class", empty_strings(args.type));
			divArray[i].attr("id", name + i);
			divArray[i].attr("numID", i);
			if(args.selectable == true) {
				divArray[i].mouseover(function() {
					//Highlight all elements up to this one
					$(this).attr("class", full_strings(args.type));
					if($(this).attr("numID") == outerDiv.attr("numselected")) {
						drawSelectedElements(outerDiv, -1, args.type);
					} 
					else {
						drawSelectedElements(outerDiv, $(this).attr("numID"), args.type);
					}
				});
			}
			outerDiv.append(divArray[i]);
		}
	
		return outerDiv;
	}

	function set_callback(callback) {
		outerDiv['callback'] = callback;
	}

	//Use this as a callback to get the nubmer selected
	function set_stylebar_selected(name, selected) {
		var outerDiv = $("#" + name);
		outerDiv.attr("numSelected", selected-1);
		redrawBar(outerDiv);
	}

	//Use this as a callback to get the nubmer selected
	function get_stylebar_selected(name) {
		return parseInt($("#" + name).attr("numSelected")) + 1;
	}

	function set_item_margin(name, size) {
		var outerDiv = $("#" + name);
		outerDiv.attr("barItemMargin", size);
		redrawBar(outerDiv);
	}

	function set_image_paths(empty, filled) {
		image_empty_path = empty;
		image_full_path = filled;
	}

	function set_item_size(name, size) {
		var outerDiv = $("#" + name);
		outerDiv.attr("itemSize", size);
		redrawBar(outerDiv);
	}

	function set_image_paths(name, emptypath, fullpath) {
		var outerDiv = $("#" + name);
		if(outerDiv.attr("type") === "image") {
			outerDiv.attr("emptyimgpath", emptypath);
			outerDiv.attr("fullimgpath", fullpath);
			redrawBar(outerDiv);
		}
	}

	function delete_stylebar(name) {
		var outerDiv = $("#" + name);
		delete callback_array[outerDiv.attr("id")];
		outerDiv.remove();
	}
	
	function attach_counter(name, func) {
		var outerDiv = $("#" + name);
		func(get_stylebar_selected(name));
		outerDiv.on("counterEvent", function(e, value) {
			func(value);
		});
		redrawBar(outerDiv);
	}
	
	function remove_counter(name) {
		var outerDiv = $("#" + name);
		outerDiv.off("counterEvent");
	}
	
	function redrawBar(outerDiv) {
		drawSelectedElements(outerDiv, outerDiv.attr("numSelected"), outerDiv.attr("type"));
	}

	function drawSelectedElements(outerDiv, numSelected, type) {
		//Edit each div as appropriate
		outerDiv.children().each(function () {
			if(parseInt($(this).attr("numID")) < numSelected && outerDiv.attr("selectionType") == "all") //Draw if filling up to a point
			{
				$(this).attr("class", full_strings(type));
				$(this).css("height", outerDiv.attr("itemSize") + "px");
				$(this).css("width", outerDiv.attr("itemSize") + "px");
				$(this).css("margin-left", outerDiv.attr("barItemMargin") + "px");
				if(type === "image") {
					$(this).attr("src", outerDiv.attr("fullimgpath"));
				} 
			} else if($(this).attr("numID") == numSelected) { //Always fill in current
				$(this).attr("class", full_strings(type));
				$(this).css("height", outerDiv.attr("itemSize") + "px");
				$(this).css("width", outerDiv.attr("itemSize") + "px");
				$(this).css("margin-left", outerDiv.attr("barItemMargin") + "px");
				if(type === "image") {
					$(this).attr("src", outerDiv.attr("fullimgpath"));
				}
			}
			else 
			{
				$(this).attr("class", empty_strings(type));		
				$(this).css("height", outerDiv.attr("itemSize") + "px");
				$(this).css("width", outerDiv.attr("itemSize") + "px");
				$(this).css("margin-left", outerDiv.attr("barItemMargin") + "px");
				if(type === "image") {
					$(this).attr("src", outerDiv.attr("emptyimgpath"));
				} 
			}
			
			//First element should not be spaced with a margin-left, this is for alignment
			if($(this).attr("numID") == 0) {
				$(this).css("margin-left", 0);
			}
		});
	
		//clear and then rebind click event for the outerDiv
		if(outerDiv.attr("dynamic")) {
			outerDiv.off("click");
			outerDiv.off("mouseleave");
		
			var eleType = type === "image" ? "img" : "div";
		
			outerDiv.on("click", eleType, function(event) {
				var newVal = outerDiv.attr("numSelected") == $(this).attr("numID") ? -1 : $(this).attr("numID");
				outerDiv.attr("numSelected", newVal);
				drawSelectedElements(outerDiv, newVal, type);
				var name = outerDiv.attr("id");
				callback_array[name](name,get_stylebar_selected(name));
			});	
			
			outerDiv.mouseleave(function() {
				drawSelectedElements(outerDiv, outerDiv.attr("numSelected"), type);
			});
			
			outerDiv.triggerHandler("counterEvent", [ parseInt(numSelected) + 1 ]);
		}
	}
	
	return {
		get_stylebar : get_stylebar,
		set_stylebar_selected : set_stylebar_selected,
		get_stylebar_selected : get_stylebar_selected,
		set_item_margin : set_item_margin,
		set_item_size : set_item_size,
		set_image_paths : set_image_paths,
		attach_counter : attach_counter,
		remove_counter : remove_counter
	}
}());