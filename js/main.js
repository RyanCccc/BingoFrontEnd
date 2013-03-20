var isMoving = false;
$(function() {
	var source = ['abc', 'ab'];
	$('.autocomplete').typeahead({
		"source": source,
		"updater": function(item) {
			setUp(item);
		}
	});
});

$(function() {

	$("#selection").hide();
	$("#selection_handle").click(function() {
		if ($("#selection").is(":hidden") && !isMoving) {
			isMoving = true;
			$("#schedule").animate({
				"width": "-=25%"
			}, 500);
			$("#selection").show("slide", {
				direction: 'right'
			}, 500, function() {
				isMoving = false;
			});
		}
		if (!$("#selection").is(":hidden") && !isMoving) {
			isMoving = true;
			$("#schedule").animate({
				"width": "+=25%"
			}, 500);
			$("#selection").hide("slide", {
				direction: 'right'
			}, 500, function() {
				isMoving = false;
			});
		}
	});
	$("#selection_handle").hover(

	function() {
		if ($("#selection").is(":hidden") && $(".ui-droppable").size() == 0 && !isMoving) {
			isMoving = true;
			$("#schedule").animate({
				"width": "-=25%"
			}, 500);
			$("#selection").show("slide", {
				direction: 'right'
			}, 500, function() {
				isMoving = false;
			});
		}
	});
	$("#selection").hover(

	function() {

	},

	function() {
		if ($("#selection .draggable").size() == 0 && !$("#selection").is(":hidden") && $(".ui-droppable").size() == 0 && !isMoving) {

			isMoving = true;
			$("#selection").hide("slide", {
				direction: 'right'
			}, 500, function() {
				isMoving = false;
			});

			$("#schedule").animate({
				"width": "+=25%"
			}, 500);
		}
	});
});

function setUp(course) {
	var coursename = course;
	$(".searchBar").data('course', coursename);
	$(".searchBar").data('num_type', 3);
	$(".searchBar").data('type', ['lecture', 'lab']);


	if ($("#" + coursename).size() == 0) {
		addClass(coursename, $(".searchBar").data('type'), $(".searchBar").data('num_type'));
		if ($("#selection").is(":hidden")) {
			$("#schedule").animate({
				"width": "-=25%"
			}, 500);
			$("#selection").show("slide", {
				direction: 'right'
			}, 500, function() {
				$("#" + coursename).show("slide", {
					direction: 'up'
				}, 300);
			});
		} else {
			$("#" + coursename).show("slide", {
				direction: 'up'
			}, 300);
		}
	} else {
		alert("You have chosen " + coursename);
	}

}

function addClass(coursename, type, num_type) {
	if (num_type == 2) {
		var that = $("<div></div>").addClass("courseSec").attr("id", coursename).appendTo("#selection");
		that = $("<div>" + coursename + "</div>").addClass("className").appendTo(that);
		that = $("<div></div>").addClass("draggableItems").appendTo(that);
		var div1 = $("<div></div>").addClass("draggable_divD1").appendTo(that);
		var div2 = $("<div></div>").addClass("draggable_divD2").appendTo(that);
		var drag1 = $("<div></div>").addClass("draggable").appendTo(div1);
		var drag2 = $("<div></div>").addClass("draggable").appendTo(div2);
		createDraggableInSel(drag1, coursename, type[0]);
		createDraggableInSel(drag2, coursename, type[1]);
	} else if (num_type == 1) {
		var that = $("<div></div>").addClass("courseSec").attr("id", coursename).appendTo("#selection");
		that = $("<div>" + coursename + "</div>").addClass("className").appendTo(that);
		that = $("<div></div>").addClass("draggableItems").appendTo(that);
		var div = $("<div></div>").addClass("draggable_divS").appendTo(that);
		var drag = $("<div></div>").addClass("draggable").appendTo(div);
		createDraggableInSel(drag, coursename, "lecture");
	} else if (num_type == 3) {
		var that = $("<div></div>").addClass("courseSec").attr("id", coursename).appendTo("#selection");
		that = $("<div>" + coursename + "</div>").addClass("className").appendTo(that);
		that = $("<div></div>").addClass("draggableItems").appendTo(that);
		var div1 = $("<div></div>").addClass("draggable_divT1").appendTo(that);
		var div2 = $("<div></div>").addClass("draggable_divT2").appendTo(that);
		var div3 = $("<div></div>").addClass("draggable_divT3").appendTo(that);
		var drag1 = $("<div></div>").addClass("draggable").appendTo(div1);
		var drag2 = $("<div></div>").addClass("draggable").appendTo(div2);
		var drag3 = $("<div></div>").addClass("draggable").appendTo(div3);
		createDraggableInSel(drag1, coursename, "lecture");
		createDraggableInSel(drag2, coursename, "lab");
		createDraggableInSel(drag3, coursename, "recitation");
	} else {
		alert("addClass error");
	}

	$("#" + coursename).hide();
	//$("#" + coursename).show(1000);
}

//
// draggable has data: type, class(class name), classDetail(all the classes), dropBox(all the dropBoxes)
//

function createDraggableInSel(tt, coursename, type) {
	tt.addClass("activeDraggable");
	tt.data("type", type);
	tt.data("class", coursename);
	tt.draggable({
		revert: function(socketObj) {
			if (socketObj == false) {
				// remove conflict
				$(".RED").removeClass("RED");

				//Delete All the classes
				var removeDropBox = tt.data("dropBox");
				for (var i = 0; i < removeDropBox.length; i++) {
					for (var j = 0; j < removeDropBox[i].length; j++) {
						removeDropBox[i][j].remove();
					}
				}
				return true;
			} else {
				return true;
			}
		},
		cursorAt: {
			left: 1,
			top: 1
		}
	});


	tt.on("dragstart", function() {
		// Ajax get ALL CS180(class) lectures(type) in forms of {[day,time,duration]*,crn}
		var test1;
		var test2;
		var testclass;
		if (type == "lecture") {
			test1 = [
				[
					["Mon", 9, 1],
					["Wed", 9, 1],
					["Fri", 9, 1]
				], 10000];
			test2 = [
				[
					["Mon", 11, 1],
					["Wed", 11, 1],
					["Fri", 11, 1]
				], 10002];
			testclass = [test1, test2];
		} else if (type == "lab") {
			test1 = [
				[
					["Tu", 9, 2],
					["Th", 9, 2]
				], 10100];
			test2 = [
				[
					["Tu", 13, 2],
					["Th", 13, 2]
				], 10200];
			testclass = [test1, test2];
		} else if (type == "recitation") {
			test1 = [
				[
					["Mon", 14, 1]
				], 10120];
			test2 = [
				[
					["Fri", 14, 1]
				], 10110];
			testclass = [test1, test2];
		}
		// End Test

		tt.data("classDetail", testclass);

		//Create dropbox array
		var testDropBox = new Array(testclass.length);
		for (var j = 0; j < testclass.length; j++) {
			testDropBox[j] = new Array(testclass[j][0].length);
		}

		// Create dropbox
		for (var j = 0; j < testclass.length; j++) {
			for (var i = 0; i < testclass[j][0].length; i++) {
				var isC = isConflict(testclass[j][0][i], $(this));
				if (isC) {
					testDropBox[j][i] = createDropBox(testclass[j], testclass[j][0][i], $(this), j);
					testDropBox[j][i].hide();
				} else {
					testDropBox[j][i] = createDropBox(testclass[j], testclass[j][0][i], $(this), j);
				}
			}
		}
		tt.data("dropBox", testDropBox);
	});
}

function isConflict(part, $drag) {
	var isConf = false;
	var begin = part[1];
	var end = begin + part[2];
	$("." + part[0] + " .dropDiv").each(function() {
		if ($(this).children().size() == 1 && !$(this).is(":hidden") && !$(this).children().is($drag)) {
			var thisPart = $(this).data("classPart");
			var thisBegin = thisPart[1];
			var thisEnd = thisBegin + thisPart[2];
			if (begin >= thisBegin && begin < thisEnd) {
				isConf = true;
			}
			if ((end > thisBegin && end <= thisEnd)) {
				isConf = true;
			}
			if (isConf) {
				// TODO
				$(this).children().addClass("RED");
			}
		}
	});
	return isConf;
}

//
// DropBox has data: class(class name), classDetail(this section's detail), classPart(this dropBox's detail), dragBox, index
//

function createDropBox(classDetail, part, draggable, index) {
	var day = part[0];
	var time = part[1];
	var duration = part[2];
	var top = (time - 7) * 36 + 32;
	var height = duration * 35;
	var dropBox = $("<div></div>");
	dropBox.addClass("dropDiv").addClass("index" + index);
	dropBox.attr("value", classDetail[1]);
	dropBox.css({
		"top": top + "px",
		"height": height + "px"
	}).appendTo("." + day);
	dropBox.data("class", draggable.data("class"));
	dropBox.data("classDetail", classDetail);
	dropBox.data("classPart", part);
	dropBox.data("index", index);
	dropBox.data("dragBox", draggable);
	// createDroppableInSch
	// using hide to hide draggableInSel when dropping
	createDroppableInSch(dropBox, false);
	return dropBox;
}

function createDroppableInSch($obj, needRemove) {
	$obj.addClass("dropActive");
	$obj.droppable({
		hoverClass: function() {
			$(".dropDiv").removeClass("dropHover");
			$(".index" + $obj.data("index")).addClass("dropHover");
		},
		drop: function(event, ui) {
			// remove conflict
			$(".RED").removeClass("RED");

			var thisDraggable = $(ui.draggable);
			if (!needRemove) {
				thisDraggable.removeClass("activeDraggable");
				thisDraggable.hide();
			} else {
				thisDraggable.remove();
			}
			var thisCRN = $(this).data("classDetail")[1];

			// createDraggableInSch
			$(".dropActive").each(function() {
				if ($(this).data("classDetail")[1] == thisCRN) {
					if ($(this).children().size() == 0) {
						createDraggableInSch($(this));

					}
				} else {
					if ($(this).children().size() == 0) {
						$(this).hide(); // remove other classes
					}
				}
				$(".dropActive").removeClass("dropActive");
				$(".ui-droppable").droppable("destroy");
			});

			if ($("#selection .draggable").size() == 0) {
				disableSelection();
			}

			//Close all the dropActive status
			$(".dropActive").removeClass("dropActive");


			//Destroy all the droppable
			$(".ui-droppable").droppable("destroy");

			/*
			if($("#selection .activeDraggable").size()==0){
				disableSelection();
			}*/
		}
	});
}


function createDraggableInSch($obj) {
	var $drag = $("<div></div>").addClass("draggable").appendTo($obj);
	$drag.addClass("activeDraggableInSch");
	$drag.css({
		"width": "100%",
		"height": "100%"
	});
	$drag.data("myDropBox", $obj);
	$drag.draggable({
		revert: function(socketObj) {
			if (socketObj == false) {
				$drag.css({
					"width": "100%",
					"height": "100%"
				});

				// remove conflict
				$(".RED").removeClass("RED");


				// createDraggableInSch
				// TODO
				var thisCRN = $obj.attr("value");
				$(".dropActive").each(function() {
					if (!$(this).is(".dropInSel")) {
						if ($(this).data("classDetail")[1] == thisCRN) {
							if (!$(this).is($drag.data("myDropBox"))) {
								createDraggableInSch($(this));
							}
						} else {
							$(this).hide(); // remove other classes
						}
					} else {
						$(this).removeClass("dropInSel");
					}
				});

				if ($("#selection .draggable").size() == 0) {
					disableSelection();
				}

				//Close all the dropActive status
				$(".dropActive").removeClass("dropActive");
				$(".dropInSel").removeClass("dropInSel");
				//Destroy all the droppable
				$(".ui-droppable").droppable("destroy");

				return true;
			} else {
				return false;
			}
		},
		cursorAt: {
			left: 1,
			top: 1
		}
	});

	//draggable has data: type, class(class name), classDetail(all the classes), dropBox(all the dropBoxes)
	var dragInSel = $obj.data("dragBox");
	$drag.data("type", dragInSel.data("type"));
	$drag.data("class", dragInSel.data("class"));
	$drag.data("classDetail", dragInSel.data("classDetail"));
	$drag.data("dropBox", dragInSel.data("dropBox"));

	$drag.on("dragstart", function() {
		var thisCRN = $obj.attr("value");
		$drag.css({
			"width": "50px",
			"height": "50px"
		});

		// remove all the draggable expect itself
		$(".activeDraggableInSch").each(function() {
			if ($(this).data("myDropBox").attr("value") == thisCRN) {
				if (!$(this).is($drag)) {
					$(this).remove();
				}
			}
		});

		// recreate droppable
		var testclass = $drag.data("classDetail");
		var testDropBox = $drag.data("dropBox");
		for (var j = 0; j < testclass.length; j++) {
			for (var i = 0; i < testclass[j][0].length; i++) {
				var isC = isConflict(testclass[j][0][i], $(this));
				if (isC) {} else {
					testDropBox[j][i].show();
				}
				createDroppableInSch(testDropBox[j][i], true);
			}
		}

		// createDroppableInSel 
		createDroppableInSel(dragInSel);

		/*
			if($("#selection").is(":hidden")){
				isMoving=true;
				$("#schedule").animate({"width":"-=25%"},500);
				$("#selection").show( "slide", {direction:'right'},500,function(){isMoving=false;});
			}*/

	});
}

function createDroppableInSel($drag) {
	var $obj = $drag.parent();
	$obj.addClass("dropActive");
	$obj.addClass("dropInSel");
	$obj.droppable({
		hoverClass: "dropHover",
		drop: function(event, ui) {

			// remove conflict
			$(".RED").removeClass("RED");

			$drag.show();
			$drag.addClass("activeDraggable");

			$(ui.draggable).remove();
			//Delete all the classes
			var removeDropBox = $drag.data("dropBox");
			for (var i = 0; i < removeDropBox.length; i++) {
				for (var j = 0; j < removeDropBox[i].length; j++) {
					removeDropBox[i][j].remove();
				}
			}

			//Close all the dropActive status
			$(".dropActive").removeClass("dropActive");
			//Destroy all the droppable
			$(".ui-droppable").droppable("destroy");
		}
	});
}



function enableSelection() {
	if (!isMoving && $("#selection").is(":hidden")) {
		$("#selection").show("slide", {
			direction: 'right'
		}, 500);
		$("#schedule").animate({
			"width": "-=25%"
		}, 500);
	}
}

function disableSelection() {

	if (!isMoving && !$("#selection").is(":hidden")) {
		$("#selection").hide("slide", {
			direction: 'right'
		}, 500);
		$("#schedule").animate({
			"width": "+=25%"
		}, 500);
	}
}