function pickerDateRange(a,b){var c={aToday:"aToday",aYesterday:"aYesterday",aRecent7Days:"aRecent7Days",aRecent14Days:"aRecent14Days",aRecent30Days:"aRecent30Days",aRecent90Days:"aRecent90Days",startDate:"",endDate:"",startCompareDate:"",endCompareDate:"",minValidDate:"315507600",maxValidDate:"",success:function(){return!0},startDateId:"startDate",startCompareDateId:"startCompareDate",endDateId:"endDate",endCompareDateId:"endCompareDate",target:"",needCompare:!1,suffix:"",inputTrigger:"input_trigger",compareTrigger:"compare_trigger",compareCheckboxId:"needCompare",calendars:2,dayRangeMax:0,monthRangeMax:12,dateTable:"dateRangeDateTable",selectCss:"dateRangeSelected",compareCss:"dateRangeCompare",coincideCss:"dateRangeCoincide",firstCss:"first",lastCss:"last",clickCss:"today",disableGray:"dateRangeGray",isToday:"dateRangeToday",joinLineId:"joinLine",isSingleDay:!1,defaultText:" 至 ",singleCompare:!1,stopToday:!0,isTodayValid:!1,weekendDis:!1,disCertainDay:[],disCertainDate:[],shortOpr:!1,noCalendar:!1,theme:"gri",autoCommit:!1,autoSubmit:!1,replaceBtn:"btn_compare"},d=this;this.inputId=a,this.inputCompareId=a+"Compare",this.compareInputDiv="div_compare_"+a,this.mOpts=$.extend({},c,b),this.mOpts.calendars=Math.min(this.mOpts.calendars,3),this.mOpts.compareCss="ta"==this.mOpts.theme?this.mOpts.selectCss:this.mOpts.compareCss,this.periodObj={},this.periodObj[d.mOpts.aToday]=0,this.periodObj[d.mOpts.aYesterday]=1,this.periodObj[d.mOpts.aRecent7Days]=6,this.periodObj[d.mOpts.aRecent14Days]=13,this.periodObj[d.mOpts.aRecent30Days]=29,this.periodObj[d.mOpts.aRecent90Days]=89,this.startDefDate="";var e=""==this.mOpts.suffix?(new Date).getTime():this.mOpts.suffix;this.calendarId="calendar_"+e,this.dateListId="dateRangePicker_"+e,this.dateRangeCompareDiv="dateRangeCompareDiv_"+e,this.dateRangeDiv="dateRangeDiv_"+e,this.compareCheckBoxDiv="dateRangeCompareCheckBoxDiv_"+e,this.submitBtn="submit_"+e,this.closeBtn="closeBtn_"+e,this.preMonth="dateRangePreMonth_"+e,this.nextMonth="dateRangeNextMonth_"+e,this.startDateId=this.mOpts.startDateId+"_"+e,this.endDateId=this.mOpts.endDateId+"_"+e,this.compareCheckboxId=this.mOpts.compareCheckboxId+"_"+e,this.startCompareDateId=this.mOpts.startCompareDateId+"_"+e,this.endCompareDateId=this.mOpts.endCompareDateId+"_"+e;var f={gri:['<div id="'+this.calendarId+'" class="gri_dateRangeCalendar">','<table class="gri_dateRangePicker"><tr id="'+this.dateListId+'"></tr></table>','<div class="gri_dateRangeOptions" '+(this.mOpts.autoSubmit?' style="display:none" ':"")+">",'<div class="gri_dateRangeInput" id="'+this.dateRangeDiv+'" >','<input type="text" class="gri_dateRangeInput" name="'+this.startDateId+'" id="'+this.startDateId+'" value="'+this.mOpts.startDate+'" readonly />','<span id="'+this.mOpts.joinLineId+'"> - </span>','<input type="text" class="gri_dateRangeInput" name="'+this.endDateId+'" id="'+this.endDateId+'" value="'+this.mOpts.endDate+'" readonly /><br />',"</div>",'<div class="gri_dateRangeInput" id="'+this.dateRangeCompareDiv+'">','<input type="text" class="gri_dateRangeInput" name="'+this.startCompareDateId+'" id="'+this.startCompareDateId+'" value="'+this.mOpts.startCompareDate+'" readonly />','<span class="'+this.mOpts.joinLineId+'"> - </span>','<input type="text" class="gri_dateRangeInput" name="'+this.endCompareDateId+'" id="'+this.endCompareDateId+'" value="'+this.mOpts.endCompareDate+'" readonly />',"</div>","<div>",'<input type="button" name="'+this.submitBtn+'" id="'+this.submitBtn+'" value="确定" />','&nbsp;<a id="'+this.closeBtn+'" href="javascript:;">关闭</a>',"</div>","</div>","</div>"],ta:['<div id="'+this.calendarId+'" class="ta_calendar ta_calendar2 cf">','<div class="ta_calendar_cont cf" id="'+this.dateListId+'">',"</div>",'<div class="ta_calendar_footer cf" '+(this.mOpts.autoSubmit?' style="display:none" ':"")+">",'<div class="frm_msg">','<div id="'+this.dateRangeDiv+'">','<input type="text" class="ta_ipt_text_s" name="'+this.startDateId+'" id="'+this.startDateId+'" value="'+this.mOpts.startDate+'" readonly />','<span class="'+this.mOpts.joinLineId+'"> - </span>','<input type="text" class="ta_ipt_text_s" name="'+this.endDateId+'" id="'+this.endDateId+'" value="'+this.mOpts.endDate+'" readonly /><br />',"</div>",'<div id="'+this.dateRangeCompareDiv+'">','<input type="text" class="ta_ipt_text_s" name="'+this.startCompareDateId+'" id="'+this.startCompareDateId+'" value="'+this.mOpts.startCompareDate+'" readonly />','<span class="'+this.mOpts.joinLineId+'"> - </span>','<input type="text" class="ta_ipt_text_s" name="'+this.endCompareDateId+'" id="'+this.endCompareDateId+'" value="'+this.mOpts.endCompareDate+'" readonly />',"</div>","</div>",'<div class="frm_btn">','<input class="ta_btn ta_btn_primary" type="button" name="'+this.submitBtn+'" id="'+this.submitBtn+'" value="确定" />','<input class="ta_btn" type="button" id="'+this.closeBtn+'" value="取消"/>',"</div>","</div>","</div>"]},g={gri:['<label class="gri_contrast" for ="'+this.compareCheckboxId+'">','<input type="checkbox" class="gri_pc" name="'+this.compareCheckboxId+'" id="'+this.compareCheckboxId+'" value="1"/>对比',"</label>",'<input type="text" name="'+this.inputCompareId+'" id="'+this.inputCompareId+'" value="" class="gri_date"/>'],ta:['<label class="contrast" for ="'+this.compareCheckboxId+'">','<input type="checkbox" class="pc" name="'+this.compareCheckboxId+'" id="'+this.compareCheckboxId+'" value="1"/>对比',"</label>",'<div class="ta_date" id="'+this.compareInputDiv+'">','	<span name="dateCompare" id="'+this.inputCompareId+'" class="date_title"></span>','	<a class="opt_sel" id="'+this.mOpts.compareTrigger+'" href="#">','		<i class="i_orderd"></i>',"	</a>","</div>"]};$(g[this.mOpts.theme].join("")).insertAfter("ta"==this.mOpts.theme?$("#div_"+this.inputId):$("#"+this.inputId)),this.mOpts.noCalendar&&($("#"+this.inputId).css("display","none"),$("#"+this.compareCheckboxId).parent().css("display","none")),$(0<$("#appendParent").length?"#appendParent":document.body).append(f[this.mOpts.theme].join("")),$("#"+this.calendarId).css("z-index",9999),1>$("#"+this.mOpts.startDateId).length?$(""!=this.mOpts.target?"#"+this.mOpts.target:"body").append('<input type="hidden" id="'+this.mOpts.startDateId+'" name="'+this.mOpts.startDateId+'" value="'+this.mOpts.startDate+'" />'):$("#"+this.mOpts.startDateId).val(this.mOpts.startDate),1>$("#"+this.mOpts.endDateId).length?$(""!=this.mOpts.target?"#"+this.mOpts.target:"body").append('<input type="hidden" id="'+this.mOpts.endDateId+'" name="'+this.mOpts.endDateId+'" value="'+this.mOpts.endDate+'" />'):$("#"+this.mOpts.endDateId).val(this.mOpts.endDate),1>$("#"+this.mOpts.compareCheckboxId).length&&$(""!=this.mOpts.target?"#"+this.mOpts.target:"body").append('<input type="checkbox" id="'+this.mOpts.compareCheckboxId+'" name="'+this.mOpts.compareCheckboxId+'" value="0" style="display:none;" />'),0==this.mOpts.needCompare?($("#"+this.compareInputDiv).css("display","none"),$("#"+this.compareCheckBoxDiv).css("display","none"),$("#"+this.dateRangeCompareDiv).css("display","none"),$("#"+this.compareCheckboxId).attr("disabled",!0),$("#"+this.startCompareDateId).attr("disabled",!0),$("#"+this.endCompareDateId).attr("disabled",!0),$("#"+this.compareCheckboxId).parent().css("display","none"),$("#"+this.mOpts.replaceBtn).length>0&&$("#"+this.mOpts.replaceBtn).hide()):(1>$("#"+this.mOpts.startCompareDateId).length?$(""!=this.mOpts.target?"#"+this.mOpts.target:"body").append('<input type="hidden" id="'+this.mOpts.startCompareDateId+'" name="'+this.mOpts.startCompareDateId+'" value="'+this.mOpts.startCompareDate+'" />'):$("#"+this.mOpts.startCompareDateId).val(this.mOpts.startCompareDate),1>$("#"+this.mOpts.endCompareDateId).length?$(""!=this.mOpts.target?"#"+this.mOpts.target:"body").append('<input type="hidden" id="'+this.mOpts.endCompareDateId+'" name="'+this.mOpts.endCompareDateId+'" value="'+this.mOpts.endCompareDate+'" />'):$("#"+this.mOpts.endCompareDateId).val(this.mOpts.endCompareDate),""==this.mOpts.startCompareDate||""==this.mOpts.endCompareDate?($("#"+this.compareCheckboxId).attr("checked",!1),$("#"+this.mOpts.compareCheckboxId).attr("checked",!1)):($("#"+this.compareCheckboxId).attr("checked",!0),$("#"+this.mOpts.compareCheckboxId).attr("checked",!0))),this.dateInput=this.startDateId,this.changeInput(this.dateInput),$("#"+this.startDateId).bind("click",function(){return d.endCompareDateId==d.dateInput&&$("#"+d.startCompareDateId).val(d.startDefDate),d.startDefDate="",d.removeCSS(1),d.changeInput(d.startDateId),!1}),$("#"+this.calendarId).bind("click",function(a){a.stopPropagation()}),$("#"+this.startCompareDateId).bind("click",function(){return d.endDateId==d.dateInput&&$("#"+d.startDateId).val(d.startDefDate),d.startDefDate="",d.removeCSS(0),d.changeInput(d.startCompareDateId),!1}),$("#"+this.submitBtn).bind("click",function(){return d.close(1),d.mOpts.success({startDate:$("#"+d.mOpts.startDateId).val(),endDate:$("#"+d.mOpts.endDateId).val(),needCompare:$("#"+d.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+d.mOpts.startCompareDateId).val(),endCompareDate:$("#"+d.mOpts.endCompareDateId).val()}),!1}),$("#"+this.closeBtn).bind("click",function(){return d.close(),!1}),$("#"+this.inputId).bind("click",function(){return d.init(),d.show(!1,d),!1}),$("#"+this.mOpts.inputTrigger).bind("click",function(){return d.init(),d.show(!1,d),!1}),$("#"+this.mOpts.compareTrigger).bind("click",function(){return d.init(!0),d.show(!0,d),!1}),$("#"+this.inputCompareId).bind("click",function(){return d.init(!0),d.show(!0,d),!1}),this.mOpts.singleCompare&&("ta"===this.mOpts.theme?($("#"+d.startDateId).val(d.mOpts.startDate),$("#"+d.endDateId).val(d.mOpts.startDate),$("#"+d.startCompareDateId).val(d.mOpts.startCompareDate),$("#"+d.endCompareDateId).val(d.mOpts.startCompareDate)):($("#"+d.startDateId).val(d.mOpts.startDate),$("#"+d.endDateId).val(d.mOpts.startDate),$("#"+d.startCompareDateId).val(d.mOpts.startCompareDate),$("#"+d.endCompareDateId).val(d.mOpts.startCompareDate),$("#"+this.compareCheckboxId).attr("checked",!0),$("#"+this.mOpts.compareCheckboxId).attr("checked",!0))),$("#"+this.dateRangeCompareDiv).css("display",$("#"+this.compareCheckboxId).attr("checked")?"":"none"),$("#"+this.compareInputDiv).css("display",$("#"+this.compareCheckboxId).attr("checked")?"":"none"),$("#"+this.compareCheckboxId).bind("click",function(){$("#"+d.inputCompareId).css("display",this.checked?"":"none"),$("#"+d.dateRangeCompareDiv).css("display",this.checked?"":"none"),$("#"+d.compareInputDiv).css("display",this.checked?"":"none"),$("#"+d.startCompareDateId).css("disabled",this.checked?!1:!0),$("#"+d.endCompareDateId).css("disabled",this.checked?!1:!0),$("#"+d.mOpts.compareCheckboxId).attr("checked",$("#"+d.compareCheckboxId).attr("checked")),$("#"+d.mOpts.compareCheckboxId).val($("#"+d.compareCheckboxId).attr("checked")?1:0),$("#"+d.compareCheckboxId).attr("checked")?(sDate=d.str2date($("#"+d.startDateId).val()),sTime=sDate.getTime(),eDate=d.str2date($("#"+d.endDateId).val()),eTime=eDate.getTime(),scDate=$("#"+d.startCompareDateId).val(),ecDate=$("#"+d.endCompareDateId).val(),(""==scDate||""==ecDate)&&(ecDate=d.str2date(d.date2ymd(sDate).join("-")),ecDate.setDate(ecDate.getDate()-1),scDate=d.str2date(d.date2ymd(sDate).join("-")),scDate.setDate(scDate.getDate()-(eTime-sTime)/864e5-1),ecDate.getTime()<1e3*d.mOpts.minValidDate&&(scDate=sDate,ecDate=eDate),ecDate.getTime()>=1e3*d.mOpts.minValidDate&&scDate.getTime()<1e3*d.mOpts.minValidDate&&(scDate.setTime(1e3*d.mOpts.minValidDate),scDate=d.str2date(d.date2ymd(scDate).join("-")),ecDate.setDate(scDate.getDate()+(eTime-sTime)/864e5-1)),$("#"+d.startCompareDateId).val(d.formatDate(d.date2ymd(scDate).join("-"))),$("#"+d.endCompareDateId).val(d.formatDate(d.date2ymd(ecDate).join("-")))),d.addCSS(1),d.changeInput(d.startCompareDateId)):(d.removeCSS(1),d.changeInput(d.startDateId)),d.close(1),d.mOpts.success({startDate:$("#"+d.mOpts.startDateId).val(),endDate:$("#"+d.mOpts.endDateId).val(),needCompare:$("#"+d.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+d.mOpts.startCompareDateId).val(),endCompareDate:$("#"+d.mOpts.endCompareDateId).val()})}),this.init(),this.close(1),this.mOpts.replaceBtn&&$("#"+this.mOpts.replaceBtn).length>0&&($("#"+d.compareCheckboxId).hide(),$(".contrast").hide(),$("#"+this.mOpts.replaceBtn).bind("click",function(){var a=this;$("#"+d.compareCheckboxId).attr("checked")?$("#"+d.compareCheckboxId).removeAttr("checked"):$("#"+d.compareCheckboxId).attr("checked","checked"),$("#"+d.compareCheckboxId).click(),$("#"+d.compareCheckboxId).attr("checked")?function(){$("#"+d.compareCheckboxId).removeAttr("checked"),$(".contrast").hide(),$(a).text("按时间对比")}():function(){$("#"+d.compareCheckboxId).attr("checked","checked"),$(".contrast").show(),$(a).text("取消对比")}()})),this.mOpts.autoCommit&&this.mOpts.success({startDate:$("#"+d.mOpts.startDateId).val(),endDate:$("#"+d.mOpts.endDateId).val(),needCompare:$("#"+d.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+d.mOpts.startCompareDateId).val(),endCompareDate:$("#"+d.mOpts.endCompareDateId).val()}),$(document).bind("click",function(){d.close()})}pickerDateRange.prototype.init=function(a){var b=this,c="undefined"!=typeof a?a&&$("#"+b.compareCheckboxId).attr("checked"):$("#"+b.compareCheckboxId).attr("checked");$("#"+this.dateListId).empty();var d=""==this.mOpts.endDate?new Date:this.str2date(this.mOpts.endDate);this.calendar_endDate=new Date(d.getFullYear(),d.getMonth()+1,0);for(var e=0;e<this.mOpts.calendars;e++){var f=null;if("ta"==this.mOpts.theme?f=this.fillDate(d.getFullYear(),d.getMonth(),e):(f=document.createElement("td"),$(f).append(this.fillDate(d.getFullYear(),d.getMonth(),e)),$(f).css("vertical-align","top")),0==e)$("#"+this.dateListId).append(f);else{var g="ta"==this.mOpts.theme?$("#"+this.dateListId).find("table").get(0):$("#"+this.dateListId).find("td").get(0);$(g).before(f)}d.setMonth(d.getMonth()-1,1)}$("#"+this.preMonth).bind("click",function(){return b.calendar_endDate.setMonth(b.calendar_endDate.getMonth()-1,1),b.mOpts.endDate=b.date2ymd(b.calendar_endDate).join("-"),b.init(a),1==b.mOpts.calendars&&b.changeInput(""==$("#"+b.startDateId).val()?b.startDateId:b.endDateId),!1}),$("#"+this.nextMonth).bind("click",function(){return b.calendar_endDate.setMonth(b.calendar_endDate.getMonth()+1,1),b.mOpts.endDate=b.date2ymd(b.calendar_endDate).join("-"),b.init(a),1==b.mOpts.calendars&&b.changeInput(""==$("#"+b.startDateId).val()?b.startDateId:b.endDateId),!1}),this.calendar_startDate=new Date(d.getFullYear(),d.getMonth()+1,1),this.endDateId!=this.dateInput&&this.endCompareDateId!=this.dateInput&&this.addCSS(c&&"undefined"!=typeof a?1:0),b.addCSS(c&&"undefined"!=typeof a?1:0),$("#"+b.inputCompareId).css("display",c?"":"none"),$("#"+this.compareInputDiv).css("display",$("#"+this.compareCheckboxId).attr("checked")?"":"none");for(var h in b.periodObj)$("#"+h).length>0&&($("#"+h).unbind("click"),$("#"+h).bind("click",function(){var a="ta"==b.mOpts.theme?"active":"a";$(this).parent().nextAll().removeClass(a),$(this).parent().prevAll().removeClass(a),$(this).parent().addClass(a);var c=b.getSpecialPeriod(b.periodObj[$(this).attr("id")]);$("#"+b.startDateId).val(b.formatDate(c.otherday)),$("#"+b.endDateId).val(b.formatDate(c.today)),$("#"+b.mOpts.startDateId).val($("#"+b.startDateId).val()),$("#"+b.mOpts.endDateId).val($("#"+b.endDateId).val()),"ta"==b.mOpts.theme?$("#"+b.compareInputDiv).hide():$("#"+b.inputCompareId).css("display","none"),$("#"+b.compareCheckboxId).attr("checked",!1),$("#"+b.mOpts.compareCheckboxId).attr("checked",!1),$("#"+this.compareInputDiv).css("display",$("#"+this.compareCheckboxId).attr("checked")?"":"none"),b.close(1),$("#"+b.startCompareDateId).val(""),$("#"+b.endCompareDateId).val(""),$("#"+b.mOpts.startCompareDateId).val(""),$("#"+b.mOpts.endCompareDateId).val(""),$("#"+b.mOpts.compareCheckboxId).val(0),$("#"+b.mOpts.replaceBtn).length>0&&($(".contrast").hide(),$("#"+b.mOpts.replaceBtn).text("按时间对比")),b.mOpts.success({startDate:$("#"+b.mOpts.startDateId).val(),endDate:$("#"+b.mOpts.endDateId).val(),needCompare:$("#"+b.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+b.mOpts.startCompareDateId).val(),endCompareDate:$("#"+b.mOpts.endCompareDateId).val()})}));$(document).bind("click",function(){b.close()}),$("#"+this.inputId).bind("change",function(){""===$(this).val()&&($("#"+b.startDateId).val(""),$("#"+b.endDateId).val(""),$("#"+b.startCompareDateId).val(""),$("#"+b.endCompareDateId).val(""))})},pickerDateRange.prototype.getSpecialPeriod=function(a){var b=this,c=new Date;1==b.mOpts.isTodayValid&&""!=b.mOpts.isTodayValid||2>a?"":c.setTime(c.getTime()-864e5);var d=c.getTime()-24*a*60*60*1e3<1e3*b.mOpts.minValidDate?1e3*b.mOpts.minValidDate:c.getTime()-24*a*60*60*1e3,e=c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate();c.setTime(d);var f=c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate();return a==b.periodObj.aYesterday&&(e=f),{today:e,otherday:f}},pickerDateRange.prototype.removeCSS=function(a,b){"undefined"==typeof b&&(b=this.mOpts.theme+"_"+this.mOpts.coincideCss),"undefined"==typeof a&&(a=0);for(var c=new Date(this.calendar_startDate.getFullYear(),this.calendar_startDate.getMonth(),this.calendar_startDate.getDate()),d="",e=new Date(c);e.getTime()<=this.calendar_endDate.getTime();e.setDate(e.getDate()+1))d=0==a?this.mOpts.theme+"_"+this.mOpts.selectCss:this.mOpts.theme+"_"+this.mOpts.compareCss,$("#"+this.calendarId+"_"+this.date2ymd(e).join("-")).removeClass(d),$("#"+this.calendarId+"_"+this.date2ymd(e).join("-")).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss)},pickerDateRange.prototype.addCSS=function(a,b){"undefined"==typeof b&&(b=this.mOpts.theme+"_"+this.mOpts.coincideCss),"undefined"==typeof a&&(a=0);for(var c=this.str2date($("#"+this.startDateId).val()),d=this.str2date($("#"+this.endDateId).val()),e=this.str2date($("#"+this.startCompareDateId).val()),f=this.str2date($("#"+this.endCompareDateId).val()),g=0==a?c:e,h=0==a?d:f,i="",j=new Date(g);j.getTime()<=h.getTime();j.setDate(j.getDate()+1))0==a?(i=this.mOpts.theme+"_"+this.mOpts.selectCss,$("#"+this.calendarId+"_"+this.date2ymd(j).join("-")).removeClass(this.mOpts.firstCss).removeClass(this.mOpts.lastCss).removeClass(this.mOpts.clickCss),$("#"+this.calendarId+"_"+this.date2ymd(j).join("-")).removeClass(i)):i=this.mOpts.theme+"_"+this.mOpts.compareCss,$("#"+this.calendarId+"_"+this.date2ymd(j).join("-")).attr("class",i);"ta"==this.mOpts.theme&&($("#"+this.calendarId+"_"+this.date2ymd(new Date(g)).join("-")).removeClass().addClass(this.mOpts.firstCss),$("#"+this.calendarId+"_"+this.date2ymd(new Date(h)).join("-")).removeClass().addClass(this.mOpts.lastCss),g.getTime()==h.getTime()&&$("#"+this.calendarId+"_"+this.date2ymd(new Date(h)).join("-")).removeClass().addClass(this.mOpts.clickCss))},pickerDateRange.prototype.checkDateRange=function(a,b){var c,d=this.str2date(a),e=this.str2date(b),f=d.getTime(),g=e.getTime();if(g>=f){if(c=this.str2date(a),c.setMonth(c.getMonth()+this.mOpts.monthRangeMax),c.setDate(c.getDate()+this.mOpts.dayRangeMax-1),c.getTime()<g)return alert("结束日期不能大于："+this.date2ymd(c).join("-")),!1}else if(c=this.str2date(a),c.setMonth(c.getMonth()-this.mOpts.monthRangeMax),c.setDate(c.getDate()-this.mOpts.dayRangeMax+1),c.getTime()>g)return alert("开始日期不能小于："+this.date2ymd(c).join("-")),!1;return!0},pickerDateRange.prototype.selectDate=function(a){this.changeInput(this.dateInput);var b=this.formatDate(a);if(this.startDateId==this.dateInput)this.removeCSS(0),this.removeCSS(1),$("#"+this.calendarId+"_"+a).attr("class","ta"==this.mOpts.theme?this.mOpts.clickCss:this.mOpts.theme+"_"+this.mOpts.selectCss),this.startDefDate=$("#"+this.dateInput).val(),$("#"+this.dateInput).val(b),1==this.mOpts.singleCompare||1==this.mOpts.isSingleDay?(this.dateInput=this.startDateId,$("#"+this.endDateId).val(b),(this.mOpts.shortOpr||this.mOpts.autoSubmit)&&this.close(1),this.mOpts.success({startDate:$("#"+this.mOpts.startDateId).val(),endDate:$("#"+this.mOpts.endDateId).val(),needCompare:$("#"+this.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+this.mOpts.startCompareDateId).val(),endCompareDate:$("#"+this.mOpts.endCompareDateId).val()})):this.dateInput=this.endDateId;else if(this.endDateId==this.dateInput){if(""==$("#"+this.startDateId).val())return this.dateInput=this.startDateId,this.selectDate(a),!1;if(0==this.checkDateRange($("#"+this.startDateId).val(),a))return!1;-1==this.compareStrDate(a,$("#"+this.startDateId).val())&&($("#"+this.dateInput).val($("#"+this.startDateId).val()),$("#"+this.startDateId).val(b),b=$("#"+this.dateInput).val()),$("#"+this.dateInput).val(b),this.dateInput=this.startDateId,this.removeCSS(0),this.addCSS(0),this.startDefDate="",this.mOpts.autoSubmit&&(this.close(1),this.mOpts.success({startDate:$("#"+this.mOpts.startDateId).val(),endDate:$("#"+this.mOpts.endDateId).val(),needCompare:$("#"+this.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+this.mOpts.startCompareDateId).val(),endCompareDate:$("#"+this.mOpts.endCompareDateId).val()}))}else if(this.startCompareDateId==this.dateInput)this.removeCSS(1),this.removeCSS(0),$("#"+this.calendarId+"_"+a).attr("class","ta"==this.mOpts.theme?this.mOpts.clickCss:this.mOpts.theme+"_"+this.mOpts.compareCss),this.startDefDate=$("#"+this.dateInput).val(),$("#"+this.dateInput).val(b),1==this.mOpts.singleCompare||1==this.mOpts.isSingleDay?(this.dateInput=this.startCompareDateId,$("#"+this.endCompareDateId).val(b),(this.mOpts.shortOpr||this.mOpts.autoSubmit)&&this.close(1),this.mOpts.success({startDate:$("#"+this.mOpts.startDateId).val(),endDate:$("#"+this.mOpts.endDateId).val(),needCompare:$("#"+this.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+this.mOpts.startCompareDateId).val(),endCompareDate:$("#"+this.mOpts.endCompareDateId).val()})):this.dateInput=this.endCompareDateId;else if(this.endCompareDateId==this.dateInput){if(""==$("#"+this.startCompareDateId).val())return this.dateInput=this.startCompareDateId,this.selectDate(a),!1;if(0==this.checkDateRange($("#"+this.startCompareDateId).val(),a))return!1;-1==this.compareStrDate(a,$("#"+this.startCompareDateId).val())&&($("#"+this.dateInput).val($("#"+this.startCompareDateId).val()),$("#"+this.startCompareDateId).val(b),b=$("#"+this.dateInput).val()),$("#"+this.dateInput).val(b),this.dateInput=this.startCompareDateId,this.removeCSS(1),this.addCSS(1),this.startDefDate="",this.mOpts.autoSubmit&&(this.close(1),this.mOpts.success({startDate:$("#"+this.mOpts.startDateId).val(),endDate:$("#"+this.mOpts.endDateId).val(),needCompare:$("#"+this.mOpts.compareCheckboxId).val(),startCompareDate:$("#"+this.mOpts.startCompareDateId).val(),endCompareDate:$("#"+this.mOpts.endCompareDateId).val()}))}},pickerDateRange.prototype.show=function(a,b){$("#"+b.dateRangeDiv).css("display",a?"none":""),$("#"+b.dateRangeCompareDiv).css("display",a?"":"none");var c=a?$("#"+this.inputCompareId).offset():$("#"+this.inputId).offset(),d=(a?$("#"+this.inputCompareId).height():$("#"+this.inputId).height(),parseInt($(document.body)[0].clientWidth)),e=c.left;return $("#"+this.calendarId).css("display","block"),(1==this.mOpts.singleCompare||1==this.mOpts.isSingleDay)&&($("#"+this.endDateId).css("display","none"),$("#"+this.endCompareDateId).css("display","none"),$("#"+this.mOpts.joinLineId).css("display","none"),$("."+this.mOpts.joinLineId).css("display","none")),d>0&&$("#"+this.calendarId).width()+c.left>d&&(e=c.left+$("#"+this.inputId).width()-$("#"+this.calendarId).width()+(/msie/i.test(navigator.userAgent)&&!/opera/i.test(navigator.userAgent)?5:0),"ta"==b.mOpts.theme&&(e+=50)),$("#"+this.calendarId).css("left",e+"px"),$("#"+this.calendarId).css("top",c.top+("ta"==b.mOpts.theme?35:22)+"px"),this.changeInput(a?this.startCompareDateId:this.startDateId),!1},pickerDateRange.prototype.close=function(a){if(a){this.mOpts.shortOpr===!0?($("#"+this.inputId).val($("#"+this.startDateId).val()),$("#"+this.inputCompareId).val($("#"+this.startCompareDateId).val())):$("#"+this.inputId).val($("#"+this.startDateId).val()+(""==$("#"+this.endDateId).val()?"":this.mOpts.defaultText+$("#"+this.endDateId).val()));var b=1==this.mOpts.isTodayValid&&""!=this.mOpts.isTodayValid?(new Date).getTime():(new Date).getTime()-864e5,c=this.str2date($("#"+this.startDateId).val()).getTime(),d=this.str2date($("#"+this.endDateId).val()).getTime();if(c>d){var e=$("#"+this.startDateId).val();$("#"+this.startDateId).val($("#"+this.endDateId).val()),$("#"+this.endDateId).val(e)}var f=1==this.mOpts.shortOpr?$("#"+this.startDateId).val():$("#"+this.startDateId).val()+(""==$("#"+this.endDateId).val()?"":this.mOpts.defaultText+$("#"+this.endDateId).val()),g=document.getElementById(this.inputId);if(g&&"INPUT"==g.tagName?($("#"+this.inputId).val(f),$("#"+this.inputCompareId).is(":visible")&&$("#"+this.inputCompareId).val(k)):($("#"+this.inputId).html(f),$("#"+this.inputCompareId).is(":visible")&&$("#"+this.inputCompareId).html(k)),"ta"!=this.mOpts.theme&&""!=$("#"+this.startCompareDateId).val()&&""!=$("#"+this.endCompareDateId).val()){var h=this.str2date($("#"+this.startCompareDateId).val()).getTime(),i=this.str2date($("#"+this.endCompareDateId).val()).getTime(),j=h+d-c;j>b&&(j=b,$("#"+this.startCompareDateId).val(this.formatDate(this.date2ymd(new Date(j+c-d)).join("-")))),$("#"+this.endCompareDateId).val(this.formatDate(this.date2ymd(new Date(j)).join("-")));var h=this.str2date($("#"+this.startCompareDateId).val()).getTime(),i=this.str2date($("#"+this.endCompareDateId).val()).getTime();if(h>i){var e=$("#"+this.startCompareDateId).val();$("#"+this.startCompareDateId).val($("#"+this.endCompareDateId).val()),$("#"+this.endCompareDateId).val(e)}}var k=1==this.mOpts.shortOpr?$("#"+this.startCompareDateId).val():$("#"+this.startCompareDateId).val()+(""==$("#"+this.endCompareDateId).val()?"":this.mOpts.defaultText+$("#"+this.endCompareDateId).val());g&&"INPUT"==g.tagName?$("#"+this.inputCompareId).val(k):$("#"+this.inputCompareId).html(k);$("#"+this.mOpts.startDateId).val($("#"+this.startDateId).val()),$("#"+this.mOpts.endDateId).val($("#"+this.endDateId).val()),$("#"+this.mOpts.startCompareDateId).val($("#"+this.startCompareDateId).val()),$("#"+this.mOpts.endCompareDateId).val($("#"+this.endCompareDateId).val());for(var l in this.periodObj)$("#"+this.mOpts[l])&&$("#"+this.mOpts[l]).parent().removeClass("a")}return $("#"+this.calendarId).css("display","none"),!1},pickerDateRange.prototype.fillDate=function(a,b,c){var d=this,e="ta"==this.mOpts.theme,f=new Date(a,b,1),g=new Date(a,b,1),h=g.getDay();g.setDate(1-h);var i=new Date(a,b+1,0),j=new Date(a,b+1,0);h=j.getDay(),j.setDate(j.getDate()+6-h);var k=new Date,l=k.getDate(),m=k.getMonth(),n=k.getFullYear(),o=document.createElement("table");if(e){o.className=this.mOpts.dateTable,cap=document.createElement("caption"),$(cap).append(a+"年"+(b+1)+"月"),$(o).append(cap),thead=document.createElement("thead"),tr=document.createElement("tr");for(var p=["日","一","二","三","四","五","六"],q=0;7>q;q++)th=document.createElement("th"),$(th).append(p[q]),$(tr).append(th);$(thead).append(tr),$(o).append(thead),tr=document.createElement("tr"),td=document.createElement("td"),0==c&&$(td).append('<a href="javascript:void(0);" id="'+this.nextMonth+'"><i class="i_next"></i></a>'),c+1==this.mOpts.calendars&&$(td).append('<a href="javascript:void(0);" id="'+this.preMonth+'"><i class="i_pre"></i></a>'),$(td).attr("colSpan",7),$(td).css("text-align","center"),$(tr).append(td),$(o).append(tr)}else{o.className=this.mOpts.theme+"_"+this.mOpts.dateTable,tr=document.createElement("tr"),td=document.createElement("td"),0==c&&$(td).append('<a href="javascript:void(0);" id="'+this.nextMonth+'" class="gri_dateRangeNextMonth"><span>next</span></a>'),c+1==this.mOpts.calendars&&$(td).append('<a href="javascript:void(0);" id="'+this.preMonth+'" class="gri_dateRangePreMonth"><span>pre</span></a>'),$(td).append(a+"年"+(b+1)+"月"),$(td).attr("colSpan",7),$(td).css("text-align","center"),$(td).css("background-color","#F9F9F9"),$(tr).append(td),$(o).append(tr);var p=["日","一","二","三","四","五","六"];tr=document.createElement("tr");for(var q=0;7>q;q++)td=document.createElement("td"),$(td).append(p[q]),$(tr).append(td);$(o).append(tr)}for(var r="",s=0,t="",u=g;u.getTime()<=j.getTime();u.setDate(u.getDate()+1)){if(u.getTime()<f.getTime())r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="-1";else if(u.getTime()>i.getTime())r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="1";else if(1==this.mOpts.stopToday&&u.getTime()>k.getTime()||u.getTime()<1e3*d.mOpts.minValidDate||""!==d.mOpts.maxValidDate&&u.getTime()>1e3*d.mOpts.maxValidDate)r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="2";else{if(s="0",u.getDate()==l&&u.getMonth()==m&&u.getFullYear()==n?1==this.mOpts.isTodayValid?r=this.mOpts.theme+"_"+this.mOpts.isToday:(r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="2"):r="",!this.mOpts.weekendDis||6!=u.getDay()&&0!=u.getDay()||(r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="3"),this.mOpts.disCertainDay&&this.mOpts.disCertainDay.length>0)for(var v in this.mOpts.disCertainDay)isNaN(this.mOpts.disCertainDay[v])||u.getDay()!==this.mOpts.disCertainDay[v]||(r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="4");if(this.mOpts.disCertainDate&&this.mOpts.disCertainDate.length>0){var w=!1;for(var v in this.mOpts.disCertainDate)if(!isNaN(this.mOpts.disCertainDate[v])||isNaN(parseInt(this.mOpts.disCertainDate[v])))if(this.mOpts.disCertainDate[0]===!0){if(w=!(u.getDate()===this.mOpts.disCertainDate[v]),!w)break}else if(w=!(u.getDate()!==this.mOpts.disCertainDate[v]))break;w&&(r=this.mOpts.theme+"_"+this.mOpts.disableGray,s="4")}}0==u.getDay()&&(tr=document.createElement("tr")),td=document.createElement("td"),td.innerHTML=u.getDate(),""!=r&&$(td).attr("class",r),0==s&&(t=u.getFullYear()+"-"+(u.getMonth()+1)+"-"+u.getDate(),$(td).attr("id",d.calendarId+"_"+t),$(td).css("cursor","pointer"),function(a){$(td).bind("click",a,function(){return d.selectDate(a),!1})}(t)),$(tr).append(td),6==u.getDay()&&$(o).append(tr)}return o},pickerDateRange.prototype.str2date=function(a){var b=a.split("-");return new Date(b[0],b[1]-1,b[2])},pickerDateRange.prototype.compareStrDate=function(a,b){var c=this.str2date(a),d=this.str2date(b);return c.getTime()>d.getTime()?1:c.getTime()==d.getTime()?0:-1},pickerDateRange.prototype.date2ymd=function(a){return[a.getFullYear(),a.getMonth()+1,a.getDate()]},pickerDateRange.prototype.changeInput=function(a){1==this.mOpts.isSingleDay&&(a=this.startDateId);var b=[this.startDateId,this.startCompareDateId,this.endDateId,this.endCompareDateId],c="";c=a==this.startDateId||a==this.endDateId?this.mOpts.theme+"_"+this.mOpts.selectCss:this.mOpts.theme+"_"+this.mOpts.compareCss,a==this.endDateId&&this.mOpts.singleCompare&&(c=this.mOpts.theme+"_"+this.mOpts.compareCss);for(var d in b)$("#"+b[d]).removeClass(this.mOpts.theme+"_"+this.mOpts.selectCss),$("#"+b[d]).removeClass(this.mOpts.theme+"_"+this.mOpts.compareCss);$("#"+a).addClass(c),$("#"+a).css("background-repeat","repeat"),this.dateInput=a},pickerDateRange.prototype.formatDate=function(a){return a.replace(/(\d{4})\-(\d{1,2})\-(\d{1,2})/g,function(a,b,c,d){return 10>c&&(c="0"+c),10>d&&(d="0"+d),b+"-"+c+"-"+d})};