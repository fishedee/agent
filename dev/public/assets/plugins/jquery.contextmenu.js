!function(a){function b(b,i,j){var k=g[b];f=a("#"+k.id).find("ul:first").clone(!0),f.css(k.menuStyle).find("li").css(k.itemStyle).hover(function(){a(this).css(k.itemHoverStyle)},function(){a(this).css(k.itemStyle)}).find("img").css({verticalAlign:"middle",paddingRight:"2px"}),d.html(f),k.onShowMenu&&(d=k.onShowMenu(j,d)),a.each(k.bindings,function(b,e){a("#"+b,d).bind("click",function(){c(),e(i,h)})}),d.css({left:j[k.eventPosX],top:j[k.eventPosY]}).show(),k.shadow&&e.css({width:d.width(),height:d.height(),left:j.pageX+2,top:j.pageY+2}).show(),a(document).one("click",c)}function c(){d.hide(),e.hide()}var d,e,f,g,h,i={menuStyle:{listStyle:"none",padding:"1px",margin:"0px",backgroundColor:"#fff",border:"1px solid #999",width:"100px"},itemStyle:{margin:"0px",color:"#000",display:"block",cursor:"default",padding:"3px",border:"1px solid #fff",backgroundColor:"transparent"},itemHoverStyle:{border:"1px solid #0a246a",backgroundColor:"#b6bdd2"},eventPosX:"pageX",eventPosY:"pageY",shadow:!0,onContextMenu:null,onShowMenu:null};a.fn.contextMenu=function(c,f){d||(d=a('<div id="jqContextMenu"></div>').hide().css({position:"absolute",zIndex:"500"}).appendTo("body").bind("click",function(a){a.stopPropagation()})),e||(e=a("<div></div>").css({backgroundColor:"#000",position:"absolute",opacity:.2,zIndex:499}).appendTo("body").hide()),g=g||[],g.push({id:c,menuStyle:a.extend({},i.menuStyle,f.menuStyle||{}),itemStyle:a.extend({},i.itemStyle,f.itemStyle||{}),itemHoverStyle:a.extend({},i.itemHoverStyle,f.itemHoverStyle||{}),bindings:f.bindings||{},shadow:f.shadow||f.shadow===!1?f.shadow:i.shadow,onContextMenu:f.onContextMenu||i.onContextMenu,onShowMenu:f.onShowMenu||i.onShowMenu,eventPosX:f.eventPosX||i.eventPosX,eventPosY:f.eventPosY||i.eventPosY});var j=g.length-1;return a(this).bind("contextmenu",function(a){var c=g[j].onContextMenu?g[j].onContextMenu(a):!0;return h=a.target,c?(b(j,this,a),!1):void 0}),this},a.contextMenu={defaults:function(b){a.each(b,function(b,c){"object"==typeof c&&i[b]?a.extend(i[b],c):i[b]=c})}}}(jQuery),$(function(){$("div.contextMenu").hide()});