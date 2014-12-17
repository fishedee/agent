var page = 'message';
var pageFrom = 0;
var pageSize = 5;
var userId = _get("userId");
var dealId = "";

var overlay = [];
$(document).on('ajaxBeforeSend', function(e, xhr, options){
var opts = {
		lines: 13, // The number of lines to draw length: 11, // The length of each line
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
/*
		window.setTimeout(function() {
			p.update({
				icon: "img/check.png",
				text: "加载完成"
			});
		}, 1e3);
*/
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

function _hash(){
	if(location.hash == "")
		return "message";
	return location.hash.substr(1);
}

function parse(data){
	var dataObj = eval("("+data+")");
	return dataObj;
}
//window.onload = load;
window.onhashchange = load;

function load(){

	$(".page").hide();
	$(".gb-nav li").removeClass("cur");

	//page = _get('page');
	page = _hash();

	$("#page-"+page).show();
	$("#nav-"+page).addClass("cur");

	if(page == "message"){
		pageFrom = 0;
		$("#message-list").empty();
		get_message_list();	

		$("#page-message .refresh-bar").bind('click');
		$("#page-message .refresh-bar").click(function(event){
			$(this).hide();
			pageFrom += pageSize;
			get_message_list();	

   			event.stopPropagation();
			return false;
		});

		$("#page-message .action.flex .btn").unbind("click");
		$("#page-message .action.flex .btn").click(function(event){
			$("#message-list").empty();
			$("#page-message .action.flex .btn").removeClass("active");
			$(this).addClass("active");

			pageFrom = 0;
			console.log(1);
			get_message_list();

   			event.stopPropagation();
			event.preventDefault();
			return false;
		});
	}
	else if(page == "project"){
		pageFrom = 0;
		$("#project-list").empty();
		get_project_list();	

		$("#page-project .refresh-bar").unbind("click");
		$("#page-project .refresh-bar").click(function(event){
			$(this).hide();
			pageFrom += pageSize;
			get_project_list();	

   			event.stopPropagation();
			return false;
		});
	}
	else if(page == "customer"){
		pageFrom = 0;
		$("#customer-list").empty();
		get_customer_list();

		$("#page-customer #search").unbind("click");
		$("#page-customer #search").click(function(event){
			var phoneNumber = $("#page-customer #search_phoneNumber").val();
			$("#customer-list").empty();

			get_customer_list(phoneNumber);

   			event.stopPropagation();
			return false;
		});

		$("#page-customer .refresh-bar").unbind("click");
		$("#page-customer .refresh-bar").click(function(event){
			$(this).hide();
			pageFrom += pageSize;
			var phoneNumber = $("#page-customer #search_phoneNumber").val();

			get_customer_list(phoneNumber);	

   			event.stopPropagation();
			return false;
		});

		$("#page-customer .action.flex .btn").unbind("click");
		$("#page-customer .action.flex .btn").click(function(event){
			$("#customer-list").empty();
			$("#page-customer .action.flex .btn").removeClass("active");
			$(this).addClass("active");

			pageFrom = 0;
			get_customer_list();

   			event.stopPropagation();
			return false;
		});

		$.get("/json.php/MiddleMan/AddDealRequest", {
			userId: userId
		}, function(data){
			$("#addcustomer-area").empty();
			$("#addcustomer-budget").empty();

			var data = parse(data);

			if(data.retCode != 0){
				$("#addcustomer-submit").attr("disabled", "disabled");
				$("#addcustomer-submit").parent().css("background", "#ccc");
				$(".add_customer").parent().css("background", "#ccc");
				$(".add_customer").attr("disabled", "disabled");

				$("#page-customer .add_customer").unbind("click");

				return ;
			}
			else {

				$("#page-customer .add_customer").click(function(event){
					location.href='#addcustomer';

					event.stopPropagation();
					return false;
				});
			}
		});

	}
	else if(page == "addcustomer"){
		$("#nav-customer").addClass("cur");

		$(".b-bak").click(function(event){
			location.href = "#customer";

   			event.stopPropagation();
			return false;
		});

		$.get("/json.php/MiddleMan/AddDealRequest", {
			userId: userId
		}, function(data){
			$("#addcustomer-area").empty();
			$("#addcustomer-budget").empty();

			var data = parse(data);

			if(data.retCode != 0){
				//alert(data.retMessage);
				$("#addcustomer-submit").attr("disabled", "disabled");
				$("#addcustomer-submit").parent().css("background", "#ccc");
				location.href = "#customer";
				return ;
			}

			var area = data.data.areaList;
			var budget = data.data.budgetList;
		
			var option = "<option value='NULL'>请选择面积</option>";
			$("#addcustomer-area").append(option);
			for(var i in area){
				var option = "<option value='"+area[i]+"'>"+area[i]+"</option>";
				$("#addcustomer-area").append(option);
			}

			var option = "<option value='NULL'>请选择预算</option>";
			$("#addcustomer-budget").append(option);
			for(var i in budget){
				var option = "<option value='"+budget[i]+"'>"+budget[i]+"</option>";
				$("#addcustomer-budget").append(option);
			}
		});

		pageFrom = 0;
		get_project_option();
		$("#addcustomer-submit").unbind("click");
		$("#addcustomer-submit").click(add_customer);
		//$("#addcustomer-reset").click(reset_customer);
	}
	else if(page == "user"){
		pageFrom = 0;
		get_user_info();
	}
	else if(page == "detail"){
		$("#nav-customer").addClass("cur");

		pageFrom = 0;
		get_detail_info();
	}
}

var project_feed =  '<div class="feed dataItem" onclick="location.href=\'%s\'">'
	+'<div class="hd">'
	+'	<p class="info ">'
	+'	<span class="title">%s</span><span class="meta" style="float:right"><time class="time">%s</time></span>'
	+'	</p>'
	+'</div>'
	+'<div class="bd">'
	+'	<p class="img loaded">'
	+'	<img style="max-width: 320px" src="%s" /></p>'
	+'	<p class="description">%s</p>'
	+'</div>'
	+'</div>';

function get_project_list(){
	$.get("/json.php/MiddleMan/GetProjectList", {userId: userId, pageFrom: -1, pageSize: pageSize}, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}

		var project = data.data;
		for(var i in project){
			var proj = sprintf(project_feed, project[i].infoUrl , project[i].title, project[i].createTime, project[i].pictureUrl, project[i].description);
			$("#project-list").append(proj);
		}

		if(pageFrom < data.count)
			$("#page-project .refresh-bar").show();
	});
}

var message_feed =  '<div class="feed dataItem">'
	+'<div class="hd">'
	+'<h3 class="info "><span class="state">%s</span></h3>'
	+'</div>'
	+'<div class="bd">'
	+'<p style="font-size: 12px; color:#777;">'
	+'<img style="max-width: 320px" src="/public/h5/img/message.png" class="mini-em"> %s'
	+'</p>'
	+'</div>';

function get_message_list(){
	var type = $("#page-message .btn.active").attr("data");
	$.get("/json.php/MiddleMan/GetMessageList", {userId: userId, type: type, pageFrom: pageFrom, pageSize: pageSize}, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}
		var message = data.data;
		for(var i in message){
			var msg = sprintf(message_feed, message[i].createTime, message[i].message);
			$("#message-list").append(msg);
		}

		if(pageFrom < data.count)
			$("#page-message .refresh-bar").show();
	});
}

var customer_feed = '<div data="%s" onclick="click_customer_detail(this)" class="feed dataItem">'
	+'<div class="hd">'
	+'<p class="info ">'
	+'<span class="title">%s(%s)</span>'
	+'<span class="meta" style="float:right"><time class="time">%s</time></span>'
	+'</p>'
	+'</div>'
	+'<div class="hd">'
	+'<p class="description">%s</p>'
	+'<p class="info ">'
	+'<span class="meta" style="float:right;background:#ddd">%s</span>'
	+'</p>'
	+'</div>'
	+'</div>';

function get_customer_list(phoneNumber){
	if(phoneNumber == undefined){
		phoneNumber = "";
	}

	$.get("/json.php/MiddleMan/GetDealList", {userId: userId, pageFrom: pageFrom, pageSize: pageSize, phoneNumber: phoneNumber}, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}

		var deal = data.data;
		for(var i in deal){
			deal[i].limitTime = ("面积:"+deal[i].area+" 预算:"+deal[i].budget);
			var row = sprintf(customer_feed, deal[i].dealId, deal[i].name ,deal[i].phoneNumber,	deal[i].projectName, deal[i].limitTime, deal[i].stateName);
			$("#customer-list").append(row);
		}

		if(pageFrom < data.count)
			$("#page-customer .refresh-bar").show();
	});
}

function get_project_option(){
	$.get("/json.php/MiddleMan/GetProjectList", {userId: userId}, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}
		$("#addcustomer-project").empty();
		var project = data.data;
		var option  = "";
		for(var i in project){
			option += "<option value='"+project[i].projectId+"'>"+project[i].title+"</option>";
		}

		$("#addcustomer-project").append(option);
	});

}

/* add customer success */
var addcustomer_feed ='<div >%s<br>可带看时间：%s<br>失效时间：%s</div>';
/*
 * result: { tips, beg_time, end_time }
 */
function addcustomer_success(result){
	var row = sprintf(addcustomer_feed, result.tips, result.beg_time, result.end_time);
	$("#addcustomer-result").html(row);
	$("#addcustomer-viewpage").show();
	$("#addcustomer-addpage").hide();
}

function reset_customer(){
	$("#addcustomer-project").val("NULL");
	$("#addcustomer-name").val("");
	$("#addcustomer-phone").val("");

	$("#addcustomer-area").val("");
	$("#addcustomer-budget").val("");

	$("#addcustomer-viewpage").hide();
	$("#addcustomer-addpage").show();
}

function add_customer(){

	var obj = {};
	obj.userId = userId;
	obj.name = $("#addcustomer-name").val();
	obj.projectId = $("#addcustomer-project").val();
	obj.project = $("#addcustomer-project").val();
	obj.projectName = $("select#addcustomer-project option[value='"+obj.projectId+"']").text();
	obj.phoneNumber = $("#addcustomer-phone").val();

	obj.area = $("#addcustomer-area").val();
	obj.budget = $("#addcustomer-budget").val();

	if(obj.name == ""){
		alert("请输入客户名称");
		return ;
	}
	if(obj.projectId == 'NULL'){
		alert("请选择楼盘信息");
		return ;
	}
	if(obj.phoneNumber == ""){
		alert("请输入客户手机号码");
		return ;
	}
	if(obj.area == "NULL"){
		alert("请选择面积");
		return ;
	}
	if(obj.budget == "NULL"){
		alert("请选择预算");
		return ;
	}

	$("#addcustomer-submit").unbind('click');
	$("#addcustomer-submit").attr("disabled", "disabled");
	$("#addcustomer-submit").parent().css("background", "#ccc");

	$.post('/json.php/MiddleMan/AddDeal', obj, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			location.href = "#customer";
			return ;
		}
		iosOverlay({
			text: "添加成功",
			duration: 2e3,
			icon: "img/check.png",
			onhide: function(){
				//addcustomer_success(data.result);
				location.href = "#customer";
			}	
		});
		$("#addcustomer-submit").parent().css("background", "#0044cc");
		$("#addcustomer-submit").attr("disabled", null);

		$("#addcustomer-name").val("");
		$("#addcustomer-phone").val("");
	});
}

function get_user_info(){
	$.get("/json.php/MiddleMan/GetDealAchievement", {userId: userId}, function(data){
		var data = parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}
		data = data.data;
		$("#report").text(data.ClientHaveReport);
		$("#look").text(data.ClientHaveLook);
		$("#pledge").text(data.ClientHavePledge);
		$("#deal").text(data.ClientHaveDeal);
		$("#payready").text(data.ClientPayReady);
		
		$("#requestpay").text(data.RequestPay);
		$("#havepay").text(data.HavePay);

		$("#cpaying").text(data.ClientPaying);
		$("#chavepay").text(data.ClientHavePay);
	});

}

var detail_feed = '<li><h3>%s</h3><dl class="right"><span>%s</span></dl></li>';

function get_detail_info(){
	dealId = $(".feed.dataItem.active").attr("data");

	if(!dealId || dealId == ""){
		location.href = "#customer";
		return ;
	}
	$.get("/json.php/MiddleMan/GetDealInfo", {
		userId: userId, 
		dealId: dealId
	}, function(data){
		var data = JSON.parse(data);
		if(data.retCode != 0){
			alert(data.retMessage);
			return ;
		}
		data = data.data;
		$("#contact_customer").attr("href", "tel:" + data.phoneNumber);
		// wtai://wp/mc;12345678
		//$("#contact_adviserman").attr("href", "tel:" + data.adviserManPhoneNumber);

		$("#detail-name").text(data.name);
		$("#detail-project").text(data.projectName);
		$("#detail-timeline").empty();
		var stateInfo = data.stateInfo;
		var detail_list = '';
		for(var i in stateInfo){
			detail_list += sprintf(detail_feed, 
				stateInfo[i].stateName,
				stateInfo[i].createTime
			);
		}
		$("#detail-timeline").append(detail_list);
	});

	$("#appeal .btn").click(function(){
		var text = $(this).text();	
		var self = $(this);

		if(text == "提交"){
			$.post('/json.php/MiddleMan/AddDealAppeal', {
				userId: userId,
				dealId: dealId,
				message: $(".text-area").val()
			}, function(data){
				iosOverlay({
					text: "操作成功",
					duration: 2e3,
					icon: "img/check.png"
				});
			
				$(".text-area").hide();
			});
			self.text("申诉");
		}
		else {
			$(".text-area").show();
			self.text("提交");
		}
	});


}

function click_customer_detail(self){
	//dealId = dealId;
	$(self).addClass("active");
	location.href = "#detail";

	$("#sub_back").click(function(){
		location.href = "#customer";
	});
}
