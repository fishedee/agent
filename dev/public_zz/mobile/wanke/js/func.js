$(function(){var a=$(".tab-list li"),b=$(".tab-content ul");a.click(function(){$(this).addClass("cur").siblings().removeClass("cur");var c=a.index($(this)[0]);return b.hide(),$(b.get(c)).show().siblings().hidden,!1})}),$(function(){var a=$(".dis_nav a"),b=$(".item");a.click(function(){$(this).addClass("on").siblings().removeClass("on");var c=a.index($(this)[0]);return b.hide(),$(b.get(c)).show().siblings().hidden,!1})}),$(function(){var a=$(".house_info h4 a"),b=$(".house_info figure");b.hide(),$(b.get(0)).show(),a.click(function(){$(".house_info h4 a.on").removeClass("on"),$(this).addClass("on");var c=a.index($(this)[0]);return b.hide(),$(b.get(c)).show().siblings().hidden,!1})});