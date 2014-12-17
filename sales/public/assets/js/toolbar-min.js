define("bui/toolbar",["bui/common","bui/toolbar/baritem","bui/toolbar/bar","bui/toolbar/pagingbar","bui/toolbar/numberpagingbar"],function(a){var b=a("bui/common"),c=b.namespace("Toolbar");return b.mix(c,{BarItem:a("bui/toolbar/baritem"),Bar:a("bui/toolbar/bar"),PagingBar:a("bui/toolbar/pagingbar"),NumberPagingBar:a("bui/toolbar/numberpagingbar")}),c}),define("bui/toolbar/baritem",function(){var a=BUI.prefix,b=BUI.Component,c=b.UIBase,d=b.View.extend([c.ListItemView]),e=b.Controller.extend([c.ListItem],{renderUI:function(){var b=this.get("el");b.addClass(a+"inline-block"),b.attr("id")||b.attr("id",this.get("id"))}},{ATTRS:{elTagName:{view:!0,value:"li"},selectable:{value:!1},focusable:{value:!1},xview:{value:d}}},{xclass:"bar-item",priority:1}),f=e.extend({_uiSetDisabled:function(b){var c=this,d=c.get("el"),e=b?"addClass":"removeClass";d.find("button").attr("disabled",b)[e](a+"button-disabled")},_uiSetChecked:function(b){var c=this,d=c.get("el"),e=b?"addClass":"removeClass";d.find("button")[e](a+"button-checked")},_uiSetText:function(a){var b=this,c=b.get("el");c.find("button").text(a)},_uiSetbtnCls:function(a){var b=this,c=b.get("el");c.find("button").addClass(a)}},{ATTRS:{checked:{value:!1},tpl:{view:!0,value:'<button type="button" class="{btnCls}">{text}</button>'},btnCls:{sync:!1},text:{sync:!1,value:""}}},{xclass:"bar-item-button",priority:2}),g=e.extend({renderUI:function(){var a=this.get("el");a.attr("role","separator")}},{xclass:"bar-item-separator",priority:2}),h=e.extend({},{ATTRS:{width:{view:!0,value:2}}},{xclass:"bar-item-spacer",priority:2}),i=e.extend({_uiSetText:function(a){var b=this,c=b.get("el");c.html(a)}},{ATTRS:{text:{value:""}}},{xclass:"bar-item-text",priority:2});return e.types={button:f,separator:g,spacer:h,text:i},e}),define("bui/toolbar/bar",function(){var a=BUI.Component,b=a.UIBase,c=a.View.extend({renderUI:function(){var a=this.get("el");a.attr("role","toolbar"),a.attr("id")||a.attr("id",BUI.guid("bar"))}}),d=a.Controller.extend([b.ChildList],{getItem:function(a){return this.getChild(a)}},{ATTRS:{elTagName:{view:!0,value:"ul"},defaultChildClass:{value:"bar-item"},focusable:{value:!1},xview:{value:c}}},{xclass:"bar",priority:1});return d}),define("bui/toolbar/pagingbar",["bui/toolbar/bar"],function(a){var b=a("bui/toolbar/bar"),c=BUI.Component,d=c.UIBase.Bindable,e=BUI.prefix,f="first",g="prev",h="next",i="last",j="skip",k="totalPage",l="curPage",m="totalCount",n=b.extend([d],{initializer:function(){var a=this,b=a.get("children"),c=a.get("items"),d=a.get("store");(!c||c.length)&&(c=a._getItems(),BUI.each(c,function(a){b.push(a)})),d&&d.get("pageSize")&&a.set("pageSize",d.get("pageSize"))},bindUI:function(){var a=this;a._bindButtonEvent()},jumpToPage:function(a){if(!(0>=a||a>this.get("totalPage"))){var b=this,c=b.get("store"),d=b.get("pageSize"),e=a-1,f=e*d,g=b.fire("beforepagechange",{from:b.get("curPage"),to:a});c&&g!==!1&&c.load({start:f,limit:d,pageIndex:e})}},_afterStoreLoad:function(a){var b,c,d,e,f=this,g=f.get("pageSize"),h=0;h=a.get("start"),c=a.getTotalCount(),b=c-h>g?h+a.getCount():c,e=parseInt((c+g-1)/g,10),e=e>0?e:1,d=parseInt(h/g,10)+1,f.set("start",h),f.set("end",b),f.set("totalCount",c),f.set("curPage",d),f.set("totalPage",e),f._setAllButtonsState(),f._setNumberPages()},_bindButtonEvent:function(){function a(){var a=parseInt(b._getCurrentPageValue(),10);b._isPageAllowRedirect(a)?b.jumpToPage(a):b._setCurrentPageValue(b.get("curPage"))}var b=this;b._bindButtonItemEvent(f,function(){b.jumpToPage(1)}),b._bindButtonItemEvent(g,function(){b.jumpToPage(b.get("curPage")-1)}),b._bindButtonItemEvent(h,function(){b.jumpToPage(b.get("curPage")+1)}),b._bindButtonItemEvent(i,function(){b.jumpToPage(b.get("totalPage"))}),b._bindButtonItemEvent(j,function(){a()});var c=b.getItem(l);c&&c.get("el").on("keyup",function(b){b.stopPropagation(),13===b.keyCode&&a()})},_bindButtonItemEvent:function(a,b){var c=this,d=c.getItem(a);d&&d.on("click",b)},onLoad:function(a){var b=this,c=b.get("store");b._afterStoreLoad(c,a)},_getItems:function(){var a=this,b=a.get("items");return b&&b.length?b:(b=[],b.push(a._getButtonItem(f)),b.push(a._getButtonItem(g)),b.push(a._getSeparator()),b.push(a._getTextItem(k)),b.push(a._getTextItem(l)),b.push(a._getButtonItem(j)),b.push(a._getSeparator()),b.push(a._getButtonItem(h)),b.push(a._getButtonItem(i)),b.push(a._getSeparator()),b.push(a._getTextItem(m)),b)},_getButtonItem:function(a){var b=this;return{id:a,xclass:"bar-item-button",text:b.get(a+"Text"),disabled:!0,elCls:b.get(a+"Cls")}},_getSeparator:function(){return{xclass:"bar-item-separator"}},_getTextItem:function(a){var b=this;return{id:a,xclass:"bar-item-text",text:b._getTextItemTpl(a)}},_getTextItemTpl:function(a){var b=this,c={};return c[a]=b.get(a),BUI.substitute(this.get(a+"Tpl"),c)},_isPageAllowRedirect:function(a){var b=this;return a&&a>0&&a<=b.get("totalPage")&&a!==b.get("curPage")},_setAllButtonsState:function(){var a=this,b=a.get("store");b&&a._setButtonsState([g,h,f,i,j],!0),1===a.get("curPage")&&a._setButtonsState([g,f],!1),a.get("curPage")===a.get("totalPage")&&a._setButtonsState([h,i],!1)},_setButtonsState:function(a,b){var c=this,d=c.get("children");BUI.each(d,function(c){-1!==BUI.Array.indexOf(c.get("id"),a)&&c.set("disabled",!b)})},_setNumberPages:function(){var a=this,b=a.getItem(k),c=a.getItem(m);b&&b.set("content",a._getTextItemTpl(k)),a._setCurrentPageValue(a.get(l)),c&&c.set("content",a._getTextItemTpl(m))},_getCurrentPageValue:function(a){var b=this;a=a||b.getItem(l);var c=a.get("el").find("input");return c.val()},_setCurrentPageValue:function(a,b){var c=this;b=b||c.getItem(l);var d=b.get("el").find("input");d.val(a)}},{ATTRS:{firstText:{value:"首 页"},firstCls:{value:e+"pb-first"},prevText:{value:"上一页"},prevCls:{value:e+"pb-prev"},nextText:{value:"下一页"},nextCls:{value:e+"pb-next"},lastText:{value:"末 页"},lastCls:{value:e+"pb-last"},skipText:{value:"确定"},skipCls:{value:e+"pb-skip"},totalPageTpl:{value:"共 {totalPage} 页"},curPageTpl:{value:'第 <input type="text" autocomplete="off" class="'+e+'pb-page" size="20" name="inputItem"> 页'},totalCountTpl:{value:"共{totalCount}条记录"},curPage:{value:0},totalPage:{value:0},totalCount:{value:0},pageSize:{value:30},store:{}},ID_FIRST:f,ID_PREV:g,ID_NEXT:h,ID_LAST:i,ID_SKIP:j,ID_TOTAL_PAGE:k,ID_CURRENT_PAGE:l,ID_TOTAL_COUNT:m},{xclass:"pagingbar",priority:2});return n}),define("bui/toolbar/numberpagingbar",["bui/toolbar/pagingbar"],function(a){var b=(BUI.Component,a("bui/toolbar/pagingbar")),c=BUI.prefix,d=c+"button-number",e=b.extend({_getItems:function(){var a=this,c=a.get("items");return c?c:(c=[],c.push(a._getButtonItem(b.ID_PREV)),c.push(a._getButtonItem(b.ID_NEXT)),c)},_getButtonItem:function(a){var b=this;return{id:a,content:'<a href="javascript:;">'+b.get(a+"Text")+"</a>",disabled:!0}},_bindButtonEvent:function(){var a=this,b=a.get("numberButtonCls");a.constructor.superclass._bindButtonEvent.call(this),a.get("el").delegate("a","click",function(a){a.preventDefault()}),a.on("click",function(c){var d=c.target;if(d&&d.get("el").hasClass(b)){var e=d.get("id");a.jumpToPage(e)}})},_setNumberPages:function(){var a=this;a._setNumberButtons()},_setNumberButtons:function(){var a,b=this,c=b.get("curPage"),d=b.get("totalPage"),e=b._getNumberItems(c,d);b._clearNumberButtons(),BUI.each(e,function(a){b._appendNumberButton(a)}),a=b.getItem(c),a&&a.set("selected",!0)},_appendNumberButton:function(a){{var b=this,c=b.getItemCount();b.addItemAt(a,c-1)}},_clearNumberButtons:function(){for(var a=this,b=(a.getItems(),a.getItemCount());b>2;)a.removeItemAt(b-2),b=a.getItemCount()},_getNumberItems:function(a,b){function c(a,b){for(var c=a;b>=c;c++)g.push(f._getNumberItem(c))}function d(){g.push(f._getEllipsisItem())}var e,f=this,g=[],h=f.get("maxLimitCount"),i=f.get("showRangeCount");if(h>b)e=b,c(1,b);else{var j=h>=a?1:a-i,k=a+i,l=b>k?k>h?k:h:b;j>1&&(c(1,1),j>2&&d()),e=l,c(j,l)}return b>e&&(b-1>e&&d(),c(b,b)),g},_getEllipsisItem:function(){var a=this;return{disabled:!0,content:a.get("ellipsisTpl")}},_getNumberItem:function(a){var b=this;return{id:a,elCls:b.get("numberButtonCls")}}},{ATTRS:{itemStatusCls:{value:{selected:"active",disabled:"disabled"}},itemTpl:{value:'<a href="">{id}</a>'},prevText:{value:"<<"},nextText:{value:">>"},maxLimitCount:{value:4},showRangeCount:{value:1},numberButtonCls:{value:d},ellipsisTpl:{value:'<a href="#">...</a>'}}},{xclass:"pagingbar-number",priority:3});return e});