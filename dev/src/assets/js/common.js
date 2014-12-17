/**
 * User: jq
 * Date: 13-8-28
 * Time: 下午4:44
 */
function U() {
    var url = arguments[0] || [];
    var param = arguments[1] || {};
    var url_arr = url.split('/');

    if (!$.isArray(url_arr) || url_arr.length < 2 || url_arr.length > 3) {
        return '';
    }

    if (url_arr.length == 2)
        url_arr.unshift(_GROUP_);

    var pre_arr = ['g', 'm', 'a'];

    var arr = [];
    for (d in pre_arr)
        arr.push(pre_arr[d] + '=' + url_arr[d]);

    for (d in param)
        arr.push(d + '=' + param[d]);

    return _APP_+'?'+arr.join('&');
}

function url_content(url, callback, close_callback){
	$.get(url, {}, function(html){
		html_content(html, callback, close_callback);
	});
}

function html_content(html, callback, close_callback){
	var sWidth = "auto";
	if(navigator.userAgent.indexOf("MSIE 7.0") > 0){
		sWidth = "500";
	}
	
	$.colorbox.remove();
	$.colorbox({
		width:sWidth,
        html:html,
        closeButton:false,
		close: "close", 
        overlayClose:false,
        escKey:true,
        opacity:0.4,
        scrolling: false,
        callback: callback
    });

	$('#cboxContent').css('overflow', 'visible');
	$('#cboxLoadedContent').css('overflow', 'visible');
	
	$('.cancel, .close').click(function() {
		$.colorbox.close();
        close_callback && close_callback();
		
		return false;
	});

	$("#cboxOverlay").click(function(){ 
		$(this).hide();
		$("#colorbox").hide();
	});
}

var sendUrl = '';
function bind_table(url, params, callback){
	var _option = {};
	_option.table_id = 'gri_table';
	_option.key_index = 'id';
	_option.order_field = 'id';
	_option.order_type = 'asc';
	_option.page_size = 10;
	_option.container_class = "mod-basic box-table";
	_option.table_class = "mod_table";
	_option.fields = '';
	_option.summary = '';
	_option.param = {};

	var paramStr = "";
	for(var i in params){
		_option[i] = params[i];
	}
	for(var i in params.param) {
		paramStr += (i+"="+params.param[i] + "&");
	}
	if (url.indexOf('?') > 0) {
		sendUrl = url + '&' + paramStr;
	} else {
		sendUrl = url + '?' + paramStr;
	}
	
	$.getJSON(sendUrl, _option.param, function (result) {
		dt = GRI.initDataTable({
			resultObj: result,
			tableId: _option.table_id,
			data: result.data,
			summary: _option.summary,
			allFields: _option.fields,
			layout: 'auto',
			enableThClick: true,  
			stopToday: false,
			checkAll: false,
			keyIndex: _option.key_index,
			page:{
				orderField: _option.order_field,
				orderType: _option.order_type,
				ifRealPage:1,
				size: _option.page_size,
				rowCount: result.count,
				index: 0,
				url: sendUrl
			},
			 cssSetting:{
					 containerClass: _option.container_class,
					 tableClass: _option.table_class
			 },
			 callback: callback
		});
	});
}
//导出excel
function export_excel(url, form_id){
	url = url + '?' + $("#"+form_id).serialize();
	window.location.href = url;
}

function dialog(msg, callback, option){
	
	var itype = 3;
	if(option != null){
		switch(option.type){
		case "warn":
			itype = 4;
			break;
		case "error":
			itype = 6;
			break;
		default:
			itype = 3;
			break;
		}
	}
	var desc = '';
    if(option && option.desc){
        desc = option.desc;
    }
    
	var dialog = new GRI.Dialog({ 
		title : '提示信息', 
		type : itype, 
		btnType : 1, 
		content : msg,
		winSize : 2,
        desc:desc,
		extra : {zIndex : 99999,winSize : 2}
		}, 
		callback
	); 
};

function _get(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) 
		return unescape(r[2]); 
	return null;
}

// fix ie 
$.fn.showOption = function() {
    this.each(function() {
	     var opt = $(this).show();
	     $(this).parent().replaceWith(opt)
    });
}


$.fn.hideOption = function() {
    this.each(function() {
    	$(this).wrap('<span>').hide()
	});
}

$(function(){
	$('#backid').click(function(){
		window.location.href="index.html";
	});
	$('#addnew').click(function(){
		window.location.href="add.html";
	});
	
	// 侧边栏js事件
	$(".sidebar .nav-tree .mod-tree-group h3").click(function(){
		if($(this).find("i").hasClass("icon-caret")){
			$(this).find("i").removeClass("icon-caret");
			$(this).find("i").addClass("icon-caret-left");
			
			$(this).next().hide();
		}
		else {
			$(this).find("i").removeClass("icon-caret-left");
			$(this).find("i").addClass("icon-caret");
			
			$(this).next().show();
		}
	});
	$(".sidebar .nav-tree .mod-tree-group ul li").click(function(){
		$(".sidebar .nav-tree .mod-tree-group ul li").removeClass("current");
		$(this).addClass("current");
	});
});


var loadingDiv = (function(){
	var loadingDiv = document.createElement('div');
	loadingDiv.id = '__loading';
    loadingDiv.className = 'gri_body_loading';
    loadingDiv.innerHTML = "<img src='/public/assets/css/images/loading.gif' alt='加载中...' />";
    loadingDiv.style.position = "absolute";
    loadingDiv.style.left = "49%";
    loadingDiv.style.top = "45%";
    loadingDiv.style.zIndex = '9999999';
    
    return loadingDiv;
})();

(function($){
	$.JSON = {};
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	 
	if (typeof(JSON)=='object' && typeof JSON.stringify === "function") {
		$.JSON.stringify = JSON.stringify;
	} else {
		 $.JSON.stringify = function(value, replacer, space) {
			var i; gap = ""; indent = ""; 
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " "; 
				} 
			} else {
				if (typeof space === "string") {
					indent = space; 
				} 
			} 
			rep = replacer; 
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify"); 
			} 
			return str("", {"": value }); 
		}; 
	} 
	
	if (typeof(JSON)=='object' && typeof JSON.parse === "function") {
		$.JSON.parse = JSON.parse;
	} else {
		$.JSON.parse = function(text, reviver) {
			var j; 
			function walk(holder, key) {
				var k, v, value = holder[key]; 
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k); 
								if (v !== undefined) {value[k] = v; } 
							else {delete value[k]; }
						} 
					} 
				} 
				return reviver.call(holder, key, value); 
			} 
			text = String(text); 
			cx.lastIndex = 0; 
			if (cx.test(text)) {
				text = text.replace(cx, function(a) {
				return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }); 
			} 
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")"); 
				return typeof reviver === "function" ? walk({"": j }, "") : j; 
			} 
			throw new SyntaxError("JSON.parse"); 
		};
	}
	
	 	
})(jQuery);

//重写jquery的ajax方法
(function($) {
	$._ajax = $.ajax;

	$.ajax = function (opt) {		
		//加载Loading图片
		$('body').append(loadingDiv);
		
		if(opt.type==undefined) opt.type="get";
		
		$._ajax(opt).success(function(data){
			if(data.retCode == 10002){
				location.href = '/public/login.html';
			}
			/* 更新csrf_token
			if(opt.type.toLowerCase() == "post"){
				try {
					var result = $.JSON.parse(data.responseText);
					$("#__csrf_token").val(result._csrf);
				} catch (e) {
					if($.cur_log_depth ++ <= $.max_log_depth){
						$.post_error(data.responseText);
					}
				}
			}
			*/
			$('#__loading').remove();
		}); 
	};
	
})(jQuery);



