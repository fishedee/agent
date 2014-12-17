$(function(){    
    var $title = $(".tab-list li");    
    var $content = $(".tab-content ul");    
    $title.click(function(){    
        $(this).addClass("cur").siblings().removeClass("cur");
        var index = $title.index($(this)[0]);    
        $content.hide();    
        $($content.get(index)).show().siblings().hidden;    
      return false;  
    });    
});   

$(function(){    
    var $title = $(".dis_nav a");    
    var $content = $(".item");    
    $title.click(function(){    
        $(this).addClass("on").siblings().removeClass("on");
        var index = $title.index($(this)[0]);    
        $content.hide();    
        $($content.get(index)).show().siblings().hidden;    
		$($content.get(index)).find(".house_info:first-child h4 a").click();
      return false;  
    });    
}); 
  
$(function(){
    var $title = $(".house_info h4 a");    
    var $content = $(".house_info figure");    
	$content.hide();
	$($content.get(0)).show();
    $title.click(function(){
		$(".house_info h4 a.on").removeClass("on");
        $(this).addClass("on");
        var index = $title.index($(this)[0]);
        $content.hide();    
        $($content.get(index)).show().siblings().hidden;    
      return false;  
    });    
});   

