$(function(){$.fn.bootstrapFileInput=function(){this.each(function(a,b){var c=$(b);if("undefined"==typeof c.attr("data-bfi-disabled")){var d="Browse";"undefined"!=typeof c.attr("title")&&(d=c.attr("title"));var e=$("<div>").append(c.eq(0).clone()).html(),f="";c.attr("class")&&(f=" "+c.attr("class")),c.replaceWith('<a class="file-input-wrapper btn'+f+'">'+d+e+"</a>")}}).promise().done(function(){$(".file-input-wrapper").mousemove(function(a){var b,c,d,e,f,g,h,i;c=$(this),b=c.find("input"),d=c.offset().left,e=c.offset().top,f=b.width(),g=b.height(),h=a.pageX,i=a.pageY,moveInputX=h-d-f+20,moveInputY=i-e-g/2,b.css({left:moveInputX,top:moveInputY})}),$(".file-input-wrapper input[type=file]").change(function(){var a;a=$(this).val(),$(this).parent().next(".file-input-name").remove(),a=$(this).prop("files")&&$(this).prop("files").length>1?$(this)[0].files.length+" files":a.substring(a.lastIndexOf("\\")+1,a.length),$(this).parent().after('<span class="file-input-name">'+a+"</span>")})})};var a="<style>.file-input-wrapper { overflow: hidden; position: relative; cursor: pointer; z-index: 1; }.file-input-wrapper input[type=file], .file-input-wrapper input[type=file]:focus, .file-input-wrapper input[type=file]:hover { position: absolute; top: 0; left: 0; cursor: pointer; opacity: 0; filter: alpha(opacity=0); z-index: 99; outline: 0; }.file-input-name { margin-left: 8px; }</style>";$("link[rel=stylesheet]").eq(0).before(a)});