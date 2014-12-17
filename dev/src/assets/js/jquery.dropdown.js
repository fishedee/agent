
$(function(){
	$("#input_keyword").keyup(function(e){
		if(e.keyCode > 36 && e.keyCode <= 40){
			return ;
		}
		
		$("#input_keyword").empty();
		var dropdown_li = "";
		var counter = 0;
		var words = $(".sidebar .mod-tree-group ul.tree-multi li a");
		for(var i = 0; i < words.length; i++){
			var flag = false;
			var word = $.trim($(words[i]).text()).toLowerCase();
			var value = this.value.toLowerCase();
			if(word.indexOf(value) >= 0){
				flag = true;
			}
			if(flag){
				if(counter ++ > 10)
					break;
				dropdown_li += ("<li>"+ word +"</li>");
			}
		}
		$(".dropdown").html(dropdown_li).show();
	});

	$("#input_keyword").keydown(function(e){
		if(e.keyCode==13){
			search_item();
		}
	});
});

// JavaScript Document 
(function($){ 
	$.fn.extend({ 
		"changeTips":function(value){ 
			value = $.extend({ divTip:"" },value);
			var $this = $(this); 
			var indexLi = -1; 
			//点击document隐藏下拉层 
			$(document).click(function(event){ 
				if($(event.target).attr("class") == value.divTip || $(event.target).is("li")){ 
					var liVal = $(event.target).text(); 
					$this.val(liVal); 
					blus(); 
				}else{ 
					blus(); 
				} 
			});
			//隐藏下拉层 
			function blus(){ 
				$(value.divTip).hide(); 
			} 
			//键盘上下执行的函数 
			function keychang(up){ 
				if(up == "up"){ 
					if(indexLi == 0){ 
						indexLi = $(value.divTip).children().length-1; 
					}else{ 
						indexLi--; 
					} 
				}
				else{ 
					if(indexLi == $(value.divTip).children().length-1){ 
						indexLi = 0; 
					}else{ 
						indexLi++; 
					} 
				} 
				$(value.divTip).children().eq(indexLi).addClass("active").siblings().removeClass(); 
			} 
			//值发生改变时 
			function valChange(){ 
				var tex = $this.val();//输入框的值 
				//让提示层显示，并对里面的LI遍历 
				if($this.val()==""){ 
					blus(); 
				}else{ 
					$(value.divTip). 
					fadeIn()
				} 
			} 
			//输入框值发生改变的时候执行函数，这里的事件用判断处理浏览器兼容性; 
			if($.browser.msie){ 
				$(this).bind("propertychange",function(){ 
				valChange(); 
				}) 
			}else{ 
				$(this).bind("input",function(){ 
					valChange(); 
				}) 
			} 
			//鼠标点击和悬停LI 
			$(value.divTip).children(). 
				hover(function(){ 
					indexLi = $(this).index();//获取当前鼠标悬停时的LI索引值; 
					if($(this).index()!=0){ 
						$(this).addClass("active").siblings().removeClass(); 
					} 
				}) 
			//按键盘的上下移动LI的背景色 
			$this.keydown(function(event){ 
				if(event.which == 38){//向上 
					keychang("up") 
				}else if(event.which == 40){//向下 
					keychang() 
				}else if(event.which == 13){ //回车 
					var liVal = $(value.divTip).children().eq(indexLi).text(); 
					$this.val(liVal); 
					blus(); 
				} 
			}) 
		} 
	}) 
})(jQuery);