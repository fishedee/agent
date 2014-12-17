var page = 'message';
var pageFrom = 0;
var pageSize = 10;
var userId = _get("userId");
var dealId = "";

//window.onload = load;
window.onhashchange = load;

function load(){

	$(".page").hide();
	$(".footer-nav.box-flex a").removeClass("curr");

	//page = _get('page');
	page = _hash();

	$("#page-"+page).show();
	$(".footer-nav.box-flex a[data='#"+page+"']").addClass("curr");

	if(page == "message"){
		pageFrom = 0;
		$("#message-list").empty();
		get_message_list();	

		$("#page-message .refresh-bar").unbind('click');
		$("#page-message .refresh-bar").click(function(event){
			$(this).hide();
			pageFrom += pageSize;
			get_message_list();	

   			event.stopPropagation();
			return false;
		});

		$("#page-message .box-flex .flex").unbind("click");
		$("#page-message .box-flex .flex").click(function(event){
			$("#message-list").empty();
			$("#page-message .box-flex .flex").removeClass("curr");
			$(this).addClass("curr");

			pageFrom = 0;
			get_message_list();

   			event.stopPropagation();
			event.preventDefault();
			return false;
		});
	}
	else if(page == "project"){
		$("#project_iframe").attr("src", "/public/mobile/wanke/sell.html?userId="+userId);
/*
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
*/
	}
	else if(page == "customer"){
		$.get("/json.php/MiddleMan/AddDealRequest", {
			userId: userId
		}, function(data){
			var data = parse(data);
			if(data.retCode != 0){
				$("#addcustomer-submit").attr("disabled", "disabled");
				//$("#addcustomer-submit").parent().css("background", "#ccc");
				$(".add-customer").parent().css("background", "#ccc");
				$("#page-customer").css("background", "none");
				$(".add-customer").attr("disabled", "disabled");
				$(".add-customer").attr("href", null);
				$("#page-customer .add-customer").unbind("click");
				$("#page-customer .add-customer").click(function(){
					alert(data.retMessage);
				});
			}
		});

		$("input[type='tel']").val("");

		pageFrom = 0;
		$("#customer-list").empty();
		get_customer_list();

		$("#page-customer #search_phoneNumber").unbind("click");
		$("#page-customer #search_phoneNumber").click(function(){
			$("#search_phoneNumber").css("text-align", "left");
			$("#search_phoneNumber").css("background", "#fff");
			$("#search_phoneNumber").parent().parent().css("height", "110px");
			//$("#search_phoneNumber").parent().css("padding-top", "40px");
			$("#search_phoneNumber").parent().find("input[type='button']").show();
			$("#search_phoneNumber").parent().find("label").show();
		});
		$("#page-customer input[type='button']").click(function(){
			var phoneNumber = $("#page-customer #search_phoneNumber").val();
			pageFrom = 0;
			$("#customer-list").empty();
			
			get_customer_list(phoneNumber);
			$("#search_phoneNumber").css("text-align", "center");
			//$("#search_phoneNumber").css("background", "url(/public/mobile/images/ico_search.png) no-repeat 50% 50% / auto 14px #fff");
			$("#search_phoneNumber").parent().parent().css("height", "32px");
			$("#search_phoneNumber").parent().css("padding-top", "0px");
			$("#search_phoneNumber").parent().find("input[type='button']").hide();
			$("#search_phoneNumber").parent().find("label").hide();
		});

		$("#page-customer #search").unbind("click");
		$("#page-customer #search").click(function(event){
			var phoneNumber = $("#page-customer #search_phoneNumber").val();
			pageFrom = 0;
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
	}
	else if(page == "addcustomer"){
		$(".footer-nav.box-flex a[data='#customer']").addClass("curr");

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
				alert(data.retMessage);
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
		$("#addcustomer-reset").click(reset_customer);
	}
	else if(page == "user"){
		pageFrom = 0;
		get_user_info();
	}
	else if(page == "detail"){
		$(".footer-nav.box-flex a[data='#customer']").addClass("curr");

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
	$.get("/json.php/MiddleMan/GetProjectList", {userId: userId, pageFrom: pageFrom, pageSize: pageSize}, function(data){
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

var message_feed =  '<li>'
		+'<time>%s</time>'
		+'<p>%s</p>'
		+'</li>';

function get_message_list(){
	var type = $("#page-message .flex.curr").attr("data");
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

var customer_feed = '<li data="%s" onclick="click_customer_detail(this)">'
			+'<div class="t">'
			+'<h2>%s(%s)</h2>'
			+'	<span class="meta">%s</span>'
			+'</div>'
			+'<p>%s</p>'
			+'<p><span>面积：%s</span>'
			+'<span>预算：%s</span>'
			+'<span>佣金：%s</span></p>'
			+'</li>';

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
			//deal[i].limitTime = ("面积:"+deal[i].area+" 预算:"+deal[i].budget);
			var row = sprintf(customer_feed, deal[i].dealId, deal[i].name ,deal[i].phoneNumber,	deal[i].projectName, deal[i].stateName, deal[i].area, deal[i].budget, deal[i].price);
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

	$("#addcustomer-submit").attr("disabled", "disabled");

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
			icon: "/public/mobile/img/check.png",
			onhide: function(){
				//addcustomer_success(data.result);
				reset_customer();
				location.href = "#customer";
			}	
		});
		$("#addcustomer-submit").attr("disabled", null);
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
		
		$("#RequestPay").text(data.RequestPay);
		$("#HavePay").text(data.HavePay);

		$("#ClientPaying").text(data.ClientPaying);
		$("#ClientHavePay").text(data.ClientHavePay);
	});

}

var detail_feed = '<li><i></i>'
				+ '<span class="case">%s</span>'
				+ '<time>%s</time>'
				+ '</li>';
var last_detail_feed = '<li><i style="top:30px;"></i>'
				+ '<span class="case">%s</span>'
				+ '<time>%s</time>'
				+ '</li>';

function get_detail_info(){
	dealId = $("#customer-list li.active").attr("data");

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
		$("#detail-name").text(data.name);
		$("#detail-project").text(data.projectName);
		$("#detail-timeline").empty();
		var stateInfo = data.stateInfo;
		var detail_list = '';
		for(var i in stateInfo){
			if(i == 6){
				detail_list += sprintf(last_detail_feed, 
					stateInfo[i].stateName,
					stateInfo[i].createTime
				);
				break;
			}
			detail_list += sprintf(detail_feed, 
				stateInfo[i].stateName,
				stateInfo[i].createTime
			);
		}

		$("#detail-timeline").append(detail_list);
	});

	$("#appeal #cancel_appeal").unbind("click");
	$("#appeal #cancel_appeal").click(function(){
		$("#appeal .text-area").val("");
		$("#appeal").hide();
	});

	$("#appeal .btn").unbind("click");
	$("#appeal .btn").click(function(){
		if($("#appeal .text-area").val() == ""){
			alert("请输入申诉内容");
			return ;
		}

		$("#appeal .btn").unbind("click");
		$.post('/json.php/MiddleMan/AddDealAppeal', {
			userId: userId,
			dealId: dealId,
			message: $("#appeal .text-area").val()
		}, function(data){
			iosOverlay({
				text: "操作成功",
				duration: 2e3,
				icon: "/public/mobile/img/check.png"
			});
		
			$("#appeal").hide();
			$("#appeal .text-area").val("");
		});
	});

	$("#apply").click(function(){
		$("#appeal .text-area").val("");
		$("#appeal").show();
		$(".text-area").focus();
	});


}

function click_customer_detail(self){
	//dealId = dealId;
	$(self).addClass("active");
	location.href = "#detail";

	$("#sub_back").click(function(){
		location.href = "#customer";

		load();
		return false;
	});
}
