!function(a){a.jgrid.extend({searchGrid:function(b){return b=a.extend({recreateFilter:!1,drag:!0,sField:"searchField",sValue:"searchString",sOper:"searchOper",sFilter:"filters",loadDefaults:!0,beforeShowSearch:null,afterShowSearch:null,onInitializeSearch:null,closeAfterSearch:!1,closeAfterReset:!1,closeOnEscape:!1,multipleSearch:!1,cloneSearchRowOnAdd:!0,sopt:null,stringResult:void 0,onClose:null,useDataProxy:!1,overlay:!0},a.jgrid.search,b||{}),this.each(function(){function c(b,c){var d=b.p.postData[c.sFilter];if("string"==typeof d&&(d=a.jgrid.parse(d)),d&&(d.groupOp&&b.SearchFilter.setGroupOp(d.groupOp),d.rules))for(var e,f=0,g=d.rules.length,h=!1;g>f;f++)e=d.rules[f],void 0!==e.field&&void 0!==e.op&&void 0!==e.data&&(h=b.SearchFilter.setFilter({sfref:b.SearchFilter.$.find(".sf:last"),filter:a.extend({},e)}),h&&b.SearchFilter.add())}function d(c){if(b.onClose){var d=b.onClose(c);if("boolean"==typeof d&&!d)return}c.hide(),b.overlay===!0&&a(".jqgrid-overlay:first","#gbox_"+h.p.id).hide()}function e(){var c=a(".ui-searchFilter").length;if(c>1){var d=a("#"+i).css("zIndex");a("#"+i).css({zIndex:parseInt(d,10)+c})}a("#"+i).show(),b.overlay===!0&&a(".jqgrid-overlay:first","#gbox_"+h.p.id).show();try{a(":input:visible","#"+i)[0].focus()}catch(e){}}function f(c){var e=void 0!==c,f=a("#"+h.p.id),g={};b.multipleSearch===!1?(g[b.sField]=c.rules[0].field,g[b.sValue]=c.rules[0].data,g[b.sOper]=c.rules[0].op,g.hasOwnProperty(b.sFilter)&&delete g[b.sFilter]):(g[b.sFilter]=c,a.each([b.sField,b.sValue,b.sOper],function(a,b){g.hasOwnProperty(b)&&delete g[b]})),f[0].p.search=e,a.extend(f[0].p.postData,g),f.trigger("reloadGrid",[{page:1}]),b.closeAfterSearch&&d(a("#"+i))}function g(c){var e=c&&c.hasOwnProperty("reload")?c.reload:!0,f=a("#"+h.p.id),g={};f[0].p.search=!1,b.multipleSearch===!1?g[b.sField]=g[b.sValue]=g[b.sOper]="":g[b.sFilter]="",a.extend(f[0].p.postData,g),e&&f.trigger("reloadGrid",[{page:1}]),b.closeAfterReset&&d(a("#"+i))}var h=this;if(h.grid){var i="fbox_"+h.p.id,j=!0;if(a.fn.searchFilter)if(b.recreateFilter===!0&&a("#"+i).remove(),null!==a("#"+i).html()){if(a.isFunction(b.beforeShowSearch)&&(j=b.beforeShowSearch(a("#"+i)),"undefined"==typeof j&&(j=!0)),j===!1)return;e(),a.isFunction(b.afterShowSearch)&&b.afterShowSearch(a("#"+i))}else{var k,l,m,n=[],o=a("#"+h.p.id).jqGrid("getGridParam","colNames"),p=a("#"+h.p.id).jqGrid("getGridParam","colModel"),q=["eq","ne","lt","le","gt","ge","bw","bn","in","ni","ew","en","cn","nc"],r=[];if(null!==b.sopt)for(m=0,k=0;k<b.sopt.length;k++)-1!=(l=a.inArray(b.sopt[k],q))&&(r[m]={op:b.sopt[k],text:b.odata[l]},m++);else for(k=0;k<q.length;k++)r[k]={op:q[k],text:b.odata[k]};if(a.each(p,function(c,d){var e="undefined"==typeof d.search?!0:d.search,f=d.hidden===!0,g=a.extend({},{text:o[c],itemval:d.index||d.name},this.searchoptions),h=g.searchhidden===!0;if("undefined"!=typeof g.sopt&&(m=0,g.ops=[],g.sopt.length>0))for(k=0;k<g.sopt.length;k++)-1!=(l=a.inArray(g.sopt[k],q))&&(g.ops[m]={op:g.sopt[k],text:b.odata[l]},m++);if("undefined"==typeof this.stype&&(this.stype="text"),"select"==this.stype)if(void 0!==g.dataUrl);else{var i;if(g.value?i=g.value:this.editoptions&&(i=this.editoptions.value),i)if(g.dataValues=[],"string"==typeof i){var j,p=i.split(";");for(k=0;k<p.length;k++)j=p[k].split(":"),g.dataValues[k]={value:j[0],text:j[1]}}else if("object"==typeof i){k=0;for(var r in i)i.hasOwnProperty(r)&&(g.dataValues[k]={value:r,text:i[r]},k++)}}(h&&e||e&&!f)&&n.push(g)}),n.length>0){if(a("<div id='"+i+"' role='dialog' tabindex='-1'></div>").insertBefore("#gview_"+h.p.id),void 0===b.stringResult&&(b.stringResult=b.multipleSearch),h.SearchFilter=a("#"+i).searchFilter(n,{groupOps:b.groupOps,operators:r,onClose:d,resetText:b.Reset,searchText:b.Find,windowTitle:b.caption,rulesText:b.rulesText,matchText:b.matchText,onSearch:f,onReset:g,stringResult:b.stringResult,ajaxSelectOptions:a.extend({},a.jgrid.ajaxOptions,h.p.ajaxSelectOptions||{}),clone:b.cloneSearchRowOnAdd}),a(".ui-widget-overlay","#"+i).remove(),"rtl"==h.p.direction&&a(".ui-closer","#"+i).css("float","left"),b.drag===!0)if(a("#"+i+" table thead tr:first td:first").css("cursor","move"),jQuery.fn.jqDrag)a("#"+i).jqDrag(a("#"+i+" table thead tr:first td:first"));else try{a("#"+i).draggable({handle:a("#"+i+" table thead tr:first td:first")})}catch(s){}if(b.multipleSearch===!1&&(a(".ui-del, .ui-add, .ui-del, .ui-add-last, .matchText, .rulesText","#"+i).hide(),a("select[name='groupOp']","#"+i).hide()),b.multipleSearch===!0&&b.loadDefaults===!0&&c(h,b),a.isFunction(b.onInitializeSearch)&&b.onInitializeSearch(a("#"+i)),a.isFunction(b.beforeShowSearch)&&(j=b.beforeShowSearch(a("#"+i)),"undefined"==typeof j&&(j=!0)),j===!1)return;e(),a.isFunction(b.afterShowSearch)&&b.afterShowSearch(a("#"+i)),b.closeOnEscape===!0&&a("#"+i).keydown(function(b){27==b.which&&d(a("#"+i)),13==b.which&&a(".ui-search",this).click()})}}}})},updateGridRows:function(b,c,d){var e,f,g=!1;return this.each(function(){var h,i,j,k,l=this;return l.grid?(c||(c="id"),void(b&&b.length>0&&a(b).each(function(){if(j=this,i=l.rows.namedItem(j[c])){if(k=j[c],d===!0&&l.p.jsonReader.repeatitems===!0){l.p.jsonReader.cell&&(j=j[l.p.jsonReader.cell]);for(var b=0;b<j.length;b++)h=l.formatter(k,j[b],b,j,"edit"),f=l.p.colModel[b].title?{title:a.jgrid.stripHtml(h)}:{},l.p.treeGrid===!0&&e==l.p.ExpandColumn?a("td:eq("+b+") > span:first",i).html(h).attr(f):a("td:eq("+b+")",i).html(h).attr(f);return g=!0,!0}a(l.p.colModel).each(function(b){e=d===!0?this.jsonmap||this.name:this.name,void 0!==j[e]&&(h=l.formatter(k,j[e],b,j,"edit"),f=this.title?{title:a.jgrid.stripHtml(h)}:{},l.p.treeGrid===!0&&e==l.p.ExpandColumn?a("td:eq("+b+") > span:first",i).html(h).attr(f):a("td:eq("+b+")",i).html(h).attr(f),g=!0)})}}))):!1}),g},filterGrid:function(b,c){return c=a.extend({gridModel:!1,gridNames:!1,gridToolbar:!1,filterModel:[],formtype:"horizontal",autosearch:!0,formclass:"filterform",tableclass:"filtertable",buttonclass:"filterbutton",searchButton:"Search",clearButton:"Clear",enableSearch:!1,enableClear:!1,beforeSearch:null,afterSearch:null,beforeClear:null,afterClear:null,url:"",marksearched:!0},c||{}),this.each(function(){var d=this;if(this.p=c,0===this.p.filterModel.length&&this.p.gridModel===!1)return void alert("No filter is set");if(!b)return void alert("No target grid is set!");this.p.gridid=-1!=b.indexOf("#")?b:"#"+b;var e=a(this.p.gridid).jqGrid("getGridParam","colModel");if(!e)return void alert("Could not get grid colModel");if(this.p.gridModel===!0){var f,g=a(this.p.gridid)[0];a.each(e,function(a){var b=[];this.search=this.search===!1?!1:!0,f=this.editrules&&this.editrules.searchhidden===!0?!0:this.hidden===!0?!1:!0,this.search===!0&&f===!0&&(b.label=d.p.gridNames===!0?g.p.colNames[a]:"",b.name=this.name,b.index=this.index||this.name,b.stype=this.edittype||"text","select"!=b.stype&&(b.stype="text"),b.defval=this.defval||"",b.surl=this.surl||"",b.sopt=this.editoptions||{},b.width=this.width,d.p.filterModel.push(b))})}else a.each(d.p.filterModel,function(){for(var a=0;a<e.length;a++)if(this.name==e[a].name){this.index=e[a].index||this.name;break}this.index||(this.index=this.name)});var h,i=function(){var b,c,e={},f=0,g=a(d.p.gridid)[0];g.p.searchdata={},a.isFunction(d.p.beforeSearch)&&d.p.beforeSearch(),a.each(d.p.filterModel,function(){if(c=this.index,"select"===this.stype)if(b=a("select[name="+c+"]",d).val())e[c]=b,d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).addClass("dirty-cell"),f++;else{d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).removeClass("dirty-cell");try{delete g.p.postData[this.index]}catch(h){}}else if(b=a("input[name="+c+"]",d).val())e[c]=b,d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).addClass("dirty-cell"),f++;else{d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).removeClass("dirty-cell");try{delete g.p.postData[this.index]}catch(i){}}});var h=f>0?!0:!1;a.extend(g.p.postData,e);var i;d.p.url&&(i=a(g).jqGrid("getGridParam","url"),a(g).jqGrid("setGridParam",{url:d.p.url})),a(g).jqGrid("setGridParam",{search:h}).trigger("reloadGrid",[{page:1}]),i&&a(g).jqGrid("setGridParam",{url:i}),a.isFunction(d.p.afterSearch)&&d.p.afterSearch()},j=function(){var b,c,e={},f=0,g=a(d.p.gridid)[0];a.isFunction(d.p.beforeClear)&&d.p.beforeClear(),a.each(d.p.filterModel,function(){switch(c=this.index,b=this.defval?this.defval:"",this.stype||(this.stype="text"),this.stype){case"select":var h;if(a("select[name="+c+"] option",d).each(function(c){return 0===c&&(this.selected=!0),a(this).text()==b?(this.selected=!0,h=a(this).val(),!1):void 0}),h)e[c]=h,d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).addClass("dirty-cell"),f++;else{d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).removeClass("dirty-cell");try{delete g.p.postData[this.index]}catch(i){}}break;case"text":if(a("input[name="+c+"]",d).val(b),b)e[c]=b,d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).addClass("dirty-cell"),f++;else{d.p.marksearched&&a("#jqgh_"+this.name,g.grid.hDiv).removeClass("dirty-cell");try{delete g.p.postData[this.index]}catch(j){}}}});var h=f>0?!0:!1;a.extend(g.p.postData,e);var i;d.p.url&&(i=a(g).jqGrid("getGridParam","url"),a(g).jqGrid("setGridParam",{url:d.p.url})),a(g).jqGrid("setGridParam",{search:h}).trigger("reloadGrid",[{page:1}]),i&&a(g).jqGrid("setGridParam",{url:i}),a.isFunction(d.p.afterClear)&&d.p.afterClear()},k=function(){var b,c,e,f,g,k=document.createElement("tr");"horizontal"==d.p.formtype&&a(h).append(k),a.each(d.p.filterModel,function(c){f=document.createElement("td"),a(f).append("<label for='"+this.name+"'>"+this.label+"</label>"),g=document.createElement("td");var e=this;switch(this.stype||(this.stype="text"),this.stype){case"select":if(this.surl)a(g).load(this.surl,function(){e.defval&&a("select",this).val(e.defval),a("select",this).attr({name:e.index||e.name,id:"sg_"+e.name}),e.sopt&&a("select",this).attr(e.sopt),d.p.gridToolbar===!0&&e.width&&a("select",this).width(e.width),d.p.autosearch===!0&&a("select",this).change(function(){return i(),!1})});else if(e.sopt.value){var j=e.sopt.value,l=document.createElement("select");a(l).attr({name:e.index||e.name,id:"sg_"+e.name}).attr(e.sopt);var m,n,o;if("string"==typeof j){m=j.split(";");for(var p=0;p<m.length;p++)n=m[p].split(":"),o=document.createElement("option"),o.value=n[0],o.innerHTML=n[1],n[1]==e.defval&&(o.selected="selected"),l.appendChild(o)}else if("object"==typeof j)for(var q in j)j.hasOwnProperty(q)&&(c++,o=document.createElement("option"),o.value=q,o.innerHTML=j[q],j[q]==e.defval&&(o.selected="selected"),l.appendChild(o));d.p.gridToolbar===!0&&e.width&&a(l).width(e.width),a(g).append(l),d.p.autosearch===!0&&a(l).change(function(){return i(),!1})}break;case"text":var r=this.defval?this.defval:"";a(g).append("<input type='text' name='"+(this.index||this.name)+"' id='sg_"+this.name+"' value='"+r+"'/>"),e.sopt&&a("input",g).attr(e.sopt),d.p.gridToolbar===!0&&e.width&&a("input",g).width(a.browser.msie?e.width-4:e.width-2),d.p.autosearch===!0&&a("input",g).keypress(function(a){var b=a.charCode?a.charCode:a.keyCode?a.keyCode:0;return 13==b?(i(),!1):this})}"horizontal"==d.p.formtype?(d.p.gridToolbar===!0&&d.p.gridNames===!1?a(k).append(g):a(k).append(f).append(g),a(k).append(g)):(b=document.createElement("tr"),a(b).append(f).append(g),a(h).append(b))}),g=document.createElement("td"),d.p.enableSearch===!0&&(c="<input type='button' id='sButton' class='"+d.p.buttonclass+"' value='"+d.p.searchButton+"'/>",a(g).append(c),a("input#sButton",g).click(function(){return i(),!1})),d.p.enableClear===!0&&(e="<input type='button' id='cButton' class='"+d.p.buttonclass+"' value='"+d.p.clearButton+"'/>",a(g).append(e),a("input#cButton",g).click(function(){return j(),!1})),(d.p.enableClear===!0||d.p.enableSearch===!0)&&("horizontal"==d.p.formtype?a(k).append(g):(b=document.createElement("tr"),a(b).append("<td>&#160;</td>").append(g),a(h).append(b)))},l=a("<form name='SearchForm' style=display:inline;' class='"+this.p.formclass+"'></form>");h=a("<table class='"+this.p.tableclass+"' cellspacing='0' cellpading='0' border='0'><tbody></tbody></table>"),a(l).append(h),k(),a(this).append(l),this.triggerSearch=i,this.clearSearch=j})}})}(jQuery);