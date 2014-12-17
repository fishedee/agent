var t_overlay = null;

function push_overlay(msg){
	var opts = {
		lines: 13, // The number of lines to draw
		length: 11, // The length of each line
		width: 5, // The line thickness
		radius: 17, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		color: '#FFF', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var target = document.createElement("div");
	document.body.appendChild(target);
	var spinner = new Spinner(opts).spin(target);

	t_overlay = iosOverlay({
		text: msg,
		spinner: spinner
	});
}

function update_overlay(type, msg){
	if(type == 'success'){
		var icon = "img/check.png";
	}
	else {
		var icon = "img/cross.png";
	}
	window.setTimeout(function() {
		t_overlay.update({
			icon: icon,
			text: msg,
		});
		window.setTimeout(function() {
			t_overlay.hide();
		}, 4e2);
	}, 3e3);
}


var overlay = [];
$(document).on('ajaxBeforeSend', function(e, xhr, options){
var opts = {
		lines: 13, // The number of lines to draw
		length: 11, // The length of each line
		width: 5, // The line thickness
		radius: 17, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		color: '#FFF', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var target = document.createElement("div");
	document.body.appendChild(target);
	var spinner = new Spinner(opts).spin(target);

	overlay.push(iosOverlay({
		text: "拼命加载中...",
		spinner: spinner
	}));
});

$(document).on('ajaxSuccess', function(e, xhr, options){
	var i = 0;
	for(i = overlay.length; i > 1; i--){
		p = overlay[i-1];
		p.hide();
	}
	if(overlay.length > 0){
		var p = overlay.pop();
		window.setTimeout(function() {
			p.hide();
		}, 5e2);
	}
});

function _get(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
/*
function _get(paras){ 
	var url = location.href;  
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	var paraObj = {}  
	for (i=0; j=paraString[i]; i++){  
		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	}  
	var returnValue = paraObj[paras.toLowerCase()];  
	if(typeof(returnValue)=="undefined"){  
		return "";  
	}else{  
		return returnValue;  
	}  
}
*/
function _hash(){
	if(location.hash == "")
		return "message";
	return location.hash.substr(1);
}

function parse(data){
	var dataObj = eval("("+data+")");
	return dataObj;
}
