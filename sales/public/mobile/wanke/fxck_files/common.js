var FCAPP=FCAPP||{Common:{RUNTIME:{loadImg:{},records:0},init:function(){FCAPP.Common.setInfo(),FCAPP.Common.hotReport(),FCAPP.Common.initElements()},initElements:function(){var a=FCAPP.Common.RUNTIME;a.popTips=$("#popTips"),a.tipsTitle=$("#tipsTitle"),a.tipsMsg=$("#tipsMsg"),a.tipsOK=$("#tipsOK"),a.tipsCancel=$("#tipsCancel"),a.popMask=$("#popMask")},format:function(a,b){for(var c in b){var d=c,e=b[c],f=new RegExp("\\{"+d+"\\}","g");e=e.replace(/</g,"&lt;").replace(/>/g,"&gt;"),a=a.replace(f,e),a=a.replace(/&lt;\/?br&gt;/gi,"<br>")}return a},replaceAll:function(a,b,c){var d=new RegExp(b,"gm"),e=a.replace(d,c);return d=null,e},resizeLayout:function(a){var b=window.innerWidth,c=window.innerHeight;b>c?a.css("top","20%"):a.css("top","30%")},saveCookie:function(a,b,c){var d=new Date,c=parseInt(c);c=isNaN(c)?180:c,d.setTime(d.getTime()+1e3*c),document.cookie=[encodeURIComponent(a),"=",encodeURIComponent(b),"; expires=",d.toGMTString(),"; domain=trade.qq.com; path=/fangchan/"].join("")},removeCookie:function(a){document.cookie=encodeURIComponent(a)+"=; expires=Thu, 01 Jan 1970 16:00:00 GMT; domain=trade.qq.com; path=/fangchan/"},getCookie:function(a){for(var b=document.cookie.split("; "),c=0,d=b.length;d>c;c++){var e=b[c].split("=");if(e.shift()===decodeURIComponent(a))return decodeURIComponent(e.shift())}return""},hideToolbar:function(){try{WeixinJSBridge.invoke("hideToolbar")}catch(a){setTimeout(FCAPP.Common.hideToolbar,30)}},hideLoading:function(){var a=FCAPP.Common.RUNTIME;a.loading||(a.loading=$("#popFail")),a.loading&&a.loading.hide()},showLoading:function(){var a=FCAPP.Common.RUNTIME;a.loading||(a.loading=$("#popFail")),a.loading&&a.loading.show()},loadImg:function(a,b,c,d){var e,f=FCAPP.Common.RUNTIME,g=f.loadImg,h=g[b+a];(d||!h||!h.loaded&&!h.loading)&&(g[b+a]={id:b,loading:!0,loaded:!1,dom:!1},e=new Image,e.idx=b,c&&"function"==typeof c&&(e.cb=c),e.onload=e.onerror=e.onreadystatechange=function(){if(!this.readyState||4==this.readyState){var a,b=g[this.idx+this.src],c=document.documentElement.clientWidth,d=document.documentElement.clientHeight;b.loaded=!0,b.dom?a=b.dom:(a=document.getElementById(this.idx),b.dom=a),a.parentNode&&(this.cb?(this.cb(this),delete this.cb):(this.width=c,this.height=d),a.parentNode.replaceChild(this,a),this.onload=null,delete this.onload)}},e.src=a)},updateShareData:function(a){var b=location.pathname.split("/"),c=b[b.length-1].split(".")[0];""==c&&(c="index"),window.shareData=window.shareData||{};for(var d in a)"object"!=typeof a[d]&&(shareData[d]=a[d]);if(a[c])for(var d in a[c])shareData[d]=a[c][d];window.gQuery&&gQuery.qrcode&&/^\w\d+$/i.test(gQuery.qrcode)&&(shareData.qrcode=gQuery.qrcode)},jumpTo:function(a,b,c){var d=(location.pathname.split("/"),""),e="";for(var f in b)0==f.indexOf("#")?d=f+"="+b[f]:gQuery[f]=encodeURIComponent(b[f]);e=$.param(gQuery),c&&"boolean"!=typeof c?c.href=a+"?"+e+d:location.href=a+"?"+e+d},setInfo:function(){var a=location.search?location.search.substr(1):"",b=location.hash?location.hash.substr(1):"";window.gQuery=window.gHash={},a&&(window.gQuery=this.split(a)),b&&(window.gHash=this.split(b))},split:function(a){var b=a.split("&"),c={};if(b.length<1)return c;for(var d=0,e=b.length;e>d;d++){var f=b[d].split("=");2==f.length&&f[0].length&&(c[f[0]]=decodeURIComponent(f[1]))}return c},escapeHTML:function(a){return"string"==typeof a||a instanceof String?(a=a.toString().replace(/<+/gi,"&lt;").replace(/>+/gi,"&gt;"),a=a.replace(/&lt;strong&gt;/gi,"<strong>").replace(/&lt;\/strong&gt;/gi,"</strong>"),a=a.replace(/&lt;br&gt;/gi,"<br/>").replace(/&lt;\/br&gt;/gi,"<br/>"),-1!=a.indexOf("电话")&&/[\d\-]{8,11}/.test(a)&&(a=a.replace(/(\d[\d\-]+\d)/g,'<a style="color:#74a3a5" href="tel:$1">$1</a>')),a):a},timer:function(a,b){var c=a,d=86400,e=0,f=0,g=0,h=0,i="",j=$("#"+b),k=setInterval(function(){c--,c>0?(e=Math.floor(c/d),f=Math.floor(c%d/3600),g=Math.floor(c%3600/60),h=c%60,e=10>e?"0"+e:e,f=10>f?"0"+f:f,g=10>g?"0"+g:g,h=10>h?"0"+h:h,i="<p><em>"+e+"</em>天<em>"+f+"</em>小时<em>"+g+"</em>分<em>"+h+"</em>秒</p>",j.html(i)):clearInterval(k)},1e3)},addData2URL:function(a,b){var c=$.param(b);return a+=-1!=a.indexOf("?")?"&"+c:"?"+c},hotReport:function(){var a=0;setTimeout(function(){if("function"==typeof pgvMain)pgvMain();else{if(a++,a>5)return;setTimeout(arguments.callee,1e3)}},1e3)},escTpl:function(a){return a=a.replace(/<%\s*=\s*([\w+\[\.\]]+)%>/gim,"<%=FCAPP.Common.escapeHTML($1)%>")},loadShareData:function(a){var b=new Date;$.ajax({url:"data/"+(a.length?a+".":"")+"sharedata.js?"+b.getMonth()+b.getDate(),dataType:"jsonp"})},msg:function(a,b){var c=FCAPP.Common.RUNTIME,d="温馨提示",e="";return a?void(c.popTips.length&&b.msg&&(b.title&&(d=FCAPP.Common.escapeHTML(b.title)),c.tipsTitle.html(d),e=FCAPP.Common.escapeHTML(b.msg),c.tipsMsg.html(e),b.ok&&"function"==typeof b.ok?c.tipsOK.one("click",function(){b.ok.apply(null,b.okParams||[]),c.popTips.hide(),c.popMask.length&&c.popMask.hide()}):c.tipsOK.one("click",function(){c.popTips.hide(),c.popMask.length&&c.popMask.hide()}),b.no&&"function"==typeof b.no?(c.tipsCancel.show(),c.tipsCancel.one("click",function(){b.no.apply(null,b.noParams||[]),c.popTips.hide(),c.popMask.length&&c.popMask.hide()})):c.tipsCancel.one("click",function(){c.popTips.hide(),c.popMask.length&&c.popMask.hide()}),c.popMask.length&&c.popMask.show(),c.popTips.show())):(c.popTips.hide(),void(c.popMask.length&&c.popMask.hide()))}}};window.updateShareData=FCAPP.Common.updateShareData,$(document).ready(FCAPP.Common.init);