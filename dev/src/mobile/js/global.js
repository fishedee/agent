/**
 * DiscuzInterstCircle 1.0.0
 * Date: 2013-04-19
 *
 * @author:
 *
 * $Id$
 */
 $.extend({
    DIC: {
        charset: 'utf-8',
        getcookie: function(name) {
            var cookie_start = document.cookie.indexOf(name + '=');
            var cookie_end = document.cookie.indexOf(";", cookie_start);
            return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        },
        in_array: function(needle, haystack) {
            if(typeof needle == 'string' || typeof needle == 'number') {
                for(var i in haystack) {
                    if(haystack[i] == needle) {
                        return true;
                    }
                }
            }
            return false;
        },
        setcookie: function (cookieName, cookieValue, seconds, path, domain, secure) {
            var expires = new Date();
            expires.setTime(expires.getTime() + seconds);
            document.cookie = escape(cookieName) + '=' + escape(cookieValue)
                + (expires ? '; expires=' + expires.toGMTString() : '')
                + (path ? '; path=' + path : '/')
                + (domain ? '; domain=' + domain : '')
                + (secure ? '; secure' : '');
        },
        getQuery: function(key) {
            var search = window.location.search;
            if (search.indexOf('?') != -1) {
                var params = search.substr(1).split('&');
                var query = {};
                var q = [];
                var name = '';

                for (i = 0; i < params.length; i++) {
                    q = params[i].split('=');
                    name = decodeURIComponent(q[0]);

                    if (name.substr(-2) == '[]') {
                        if (!query[name]) {
                            query[name] = [];
                        }
                        query[name].push(q[1]);
                    } else {
                        query[name] = q[1];
                    }

                }
                if (key) {
                    if (query[key]) {
                        return query[key];
                    }

                    return null;
                } else {
                    return query;
                }
            }
        },
        reload: function(href, timeout) {
            href = href || '';
            timeout = timeout || 1;
            re = /^http(s)?:\/\/(([^\/\.]+\.)*)?(qq\.com)(\/.*)*$/;
            re1 = /^http(s)?:\/\//;
            setTimeout(function() {
                if (re.test(href)) {
                    window.location.href = href;
                } else if (href && !re1.test(href)) {
                    window.location.href = 'http://' +  window.location.hostname + href;
                } else {
                    window.location.reload();
                }
            }, timeout);
        },
        open: function(href) {
            re1 = /^http(s)?:\/\//;
            if (href && !re1.test(href)) {
                href = 'http://' +  window.location.hostname + href;
            }

            if (typeof mqq !== 'undefined' && mqq.version && mqq.device.isMobileQQ()) {

                href = href.indexOf('?') === -1 ? href + '?' : href + '&';
                // 增加新webview打开标识
                href = href.replace(/\&webview\=[^\&]+/g, '') + 'webview=new';
                mqq.ui.openUrl({
                    url: href,
                    target: 1,
                    style: 0
                });
                return true;
            }
            $.DIC.reload(href);
        },
        goBack: function(url) {
            var url = url || '';
            if (mqq && mqq.version && mqq.device.isMobileQQ()) {
                // 判断是新webview打开则关掉
                if (/(\?|\&)webview=new/.test(window.location.href)) {
                    mqq.ui.popBack();
                    return true;
                }
            }
            if (url) {
                jq.DIC.reload(url);
                return true;
            }
            history.go(-1);
        },
        trim: function(str){
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        isObjectEmpty: function(obj) {
            for (i in obj) {
                return false;
            }
            return true;
        },
        strlen: function(str) {
            return (/msie/.test(navigator.userAgent.toLowerCase()) && str.indexOf('\n') !== -1) ? str.replace(/\r?\n/g, '_').length : str.length;
        },
        mb_strlen: function(str) {
            var len = 0;
            for(var i = 0; i < str.length; i++) {
                len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? ($.DIC.charset.toLowerCase() === 'utf-8' ? 3 : 2) : 1;
            }
            return len;
        },
        mb_cutstr: function(str, maxlen, dot) {
            var len = 0;
            var ret = '';
            var dot = !dot && dot !== '' ? '...' : dot;
            maxlen = maxlen - dot.length;
            for(var i = 0; i < str.length; i++) {
                len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? ($.DIC.charset.toLowerCase() === 'utf-8' ? 3 : 2) : 1;
                if(len > maxlen) {
                    ret += dot;
                    break;
                }
                ret += str.substr(i, 1);
            }
            return ret;
        },
        strLenCalc: function(obj, showId, maxlen) {
            var v = obj.value, maxlen = !maxlen ? 200 : maxlen, curlen = maxlen, len = $.DIC.strlen(v);
            for(var i = 0; i < v.length; i++) {
                if(v.charCodeAt(i) < 0 || v.charCodeAt(i) > 127) {
                    curlen -= 2;
                } else {
                    curlen -= 1;
                }
            }
            $('#' + showId).html(Math.floor(curlen / 2));
        },
        dialog: function(opts) {
            setTimeout(function() {
                $.DIC._dialog(opts);
            }, 5);
        },
        _dialog: function(opts) {
            var opts = opts || {};
//            var dId = opts.id || parseInt((Math.random()*6)+1);
            var dId = opts.id || 'tips';
            var dialogId = 'fwin_dialog_' + dId;
            var maskId = 'fwin_mask_' + dId;

            // 传id 未传content 则表示隐藏或关闭对应的dialog的窗口
            if (!opts.content) {
//                $('div[id^="fwin_dialog_"]').remove();
                document.ontouchmove = function(e){ return true;}
                $('#' + dialogId).remove();
                $('#' + maskId).remove();
                return false;
            }

            // title
            var title = opts.title || '提示信息';
            // msg
            var content = opts.content || '';

            // ok
            var btnOk = opts.okValue || false;
            // cancel
            var btnCancel = opts.cancelValue || false;

            // is show mask
            var isShowMask = opts.isMask || false;

            var existDialogCount = jq('div[id^="fwin_dialog_"]').length || 0;
            var maskZIndex = 10000 + existDialogCount * 10;
            var dialogZIndex = maskZIndex + 1;

            // mask style
            var maskStyle = 'position:absolute;top:-0px;left:-0px;width:' + $(document).width() + 'px;height:' + $(document).height() + 'px;background:#000;filter:alpha(opacity=60);opacity:0.5; z-index:' + maskZIndex + ';';

            var isHtml = opts.isHtml || false;

            var autoClose = opts.autoClose || false;

            var isConfirm = opts.isConfirm || false;

            var iconClass = '';
            switch (opts.icon) {
                case 'success':
                    iconClass = 'icon_success';
                    break;
                case 'none':
                    iconClass = '';
                    break;
                case 'error':
                default:
                    iconClass = 'g-layer-tips';
                    break;
            }

            var dialogHtmlArr = [];
            if (isShowMask) {
                var dialogMaskHtmlArr = [];
                dialogMaskHtmlArr.push('<div id=' + maskId + ' class="g-mask" style="' + maskStyle + '"></div>');
                var dialogMaskHtml = dialogMaskHtmlArr.join('');
                $(dialogMaskHtml).appendTo('body');
                document.ontouchmove = function(e){ e.preventDefault();}
            }

            if (isHtml) {
                dialogHtmlArr.push('<div style="width:100%;position:fixed;z-index:' + dialogZIndex +';" id="' + dialogId + '">' + content + '</div>');
            } else {
                if (!opts.title && !btnOk && !btnCancel) {
                    dialogHtmlArr.push('<div style="position:fixed;z-index:' + dialogZIndex +';" id="' + dialogId + '"><div class="tips">');
                    if (dId == 'loading') {
                        // 菊花
                        dialogHtmlArr.push('<div class="loadInco tipL" style="vertical-align: -5px;"><span class="blockG" id="rotateG_01"></span><span class="blockG" id="rotateG_02"></span><span class="blockG" id="rotateG_03"></span><span class="blockG" id="rotateG_04"></span><span class="blockG" id="rotateG_05"></span><span class="blockG" id="rotateG_06"></span><span class="blockG" id="rotateG_07"></span><span class="blockG" id="rotateG_08"></span></div> ');
                    }
                    dialogHtmlArr.push(content + '</div></div>');
                } else if (isConfirm) {
                    if (confirm(content)) {
                        if (typeof opts.ok == 'function') {
                            opts.ok();
                        }

                    } else {
                        if (typeof opts.cancel == 'function') {
                            opts.cancel();
                        }
                    }
                    return true;
                } else {
                    dialogHtmlArr.push('<div style="min-width:350px;position:fixed;z-index:' + dialogZIndex +';" id="' + dialogId + '"><span class="close"></span>');
                    dialogHtmlArr.push('<div class="popLayer pSpace" style="width:80%">');
                    dialogHtmlArr.push('<p class="editTCon">' + content + '</p>');
                    dialogHtmlArr.push('<div class="editArea">');
                    dialogHtmlArr.push(btnOk ? '<a href="javascript:;" class="editBtn1 db" title="">' + btnOk + '</a>' : '');
                    dialogHtmlArr.push(btnCancel ? '<a href="javascript:;" class="editBtn2 db" title="">' + btnCancel + '</a>' : '');
                    dialogHtmlArr.push('</div></div>');
                }
            }
            var dialogHtml = dialogHtmlArr.join('');
            if ($('#' + dialogId)[0]) {
                $('#' + dialogId).remove();
                $('#' + maskId).remove();
            }
            $(dialogHtml).appendTo('body');

            var clientWidth = $(window).width();
            var clientHeight = $(window).height();
            dialogLeft =  (clientWidth - $('#' + dialogId).outerWidth()) / 2;
            dialogTop =  (clientHeight - $('#' + dialogId).height()) * 0.382;

            // position left
            var dialogLeft = opts.left || dialogLeft;
            // position top
            var dialogTop = typeof opts.top === 'undefined' ? dialogTop : opts.top;

            $("#" + dialogId).css({ "top": dialogTop + "px", "left": dialogLeft + "px" });

            // close click
            $('#' + dialogId + ' .close').click(function() {
                if (isShowMask) {
                    document.ontouchmove = function(e){ return true;}
                }
                var closeCBResult = true;
                // close callback
                if (typeof opts.close == 'function') {
                    closeCBResult = opts.close();
                }
                if (closeCBResult) {
                    $('#' + maskId).hide();
                    $('#' + maskId).remove();
                    $('#' + dialogId).hide();
                    $('#' + dialogId).remove();
                }
            });
            // callback
            if (typeof opts.callback == 'function') {
                if (isShowMask) {
                    document.ontouchmove = function(e){ e.preventDefault();}
                }
                opts.callback();
            }

            // ok callback
            if (typeof opts.ok == 'function') {
                $('#' + dialogId + ' .editBtn1').click(function() {
                    opts.ok();
                });
            }

            // cancel callback
            if (typeof opts.cancel == 'function') {
                $('#' + dialogId + ' .editBtn2').click(function() {
                    opts.cancel();
                });
            }

            if ($('#' + dialogId + ' .editBtn1')[0]) {
                $('#' + dialogId + ' .editBtn1').click(function() {$('#' + dialogId + ' .close').click()});
            }
            if ($('#' + dialogId + ' .editBtn2')[0]) {
                $('#' + dialogId + ' .editBtn2').click(function() {$('#' + dialogId + ' .close').click()});
            }

            // 自动关闭弹窗
            if (!opts.title && !btnOk && !btnCancel && autoClose) {
                autoClose = autoClose > 1 ? autoClose : 1000;
                setTimeout(function() {
                    $('#' + dialogId).fadeOut('slow', function() {
                        $('#' + maskId).hide();
                        $('#' + maskId).remove();
                        $('#' + dialogId).hide();
                        $('#' + dialogId).remove();
                        // close callback
                        if (typeof opts.close == 'function') {
                            opts.close();
                        }
                    });
                }, autoClose);
            }
        },
        timerId: false,
        initTouch: function(opts) {
            var obj = opts.obj || document;
            var startX, startY, endX, endY, moveTouch;
            function touchStart(event) {
                var touch = event.touches[0];
                startY = touch.pageY;
                startX = touch.pageX;
                endX = touch.pageX;
                endY = touch.pageY;
                if (typeof opts.start == 'function') {
                    opts.start(event);
                }
            }

            function touchMove(event) {
                window.clearInterval(jq.DIC.timerId);
                touch = event.touches[0];
                endX = touch.pageX;
                endY = touch.pageY;
                if (document.body.scrollTop <= 0 && (startY - endY) <= 0 && $.os.ios) {
                    event.preventDefault();
                }
//                if (Math.abs(endX - startX) > 10 && Math.abs(endY - startY) < 25) {
//                        event.preventDefault();
//                }
                if (typeof opts.move == 'function') {
                    var offset = {x:startX - endX, y:startY - endY};
                    opts.move(event, offset);
                }
                if (!$.os.ios) {
                    jq.DIC.timerId = window.setTimeout(function() {
                        touchEnd();
                    }, 50);
                }
            }
            function touchEnd(event) {
                if (typeof opts.end == 'function') {
                    var offset = {x:startX - endX, y:startY - endY};
                    opts.end(event, offset);
                }
            }

            obj.addEventListener('touchstart', touchStart, false);
            obj.addEventListener('touchmove', touchMove, false);
            if ($.os.ios) {
                obj.addEventListener('touchend', touchEnd, false);
            }
        },
        showLoading: function(display, waiting, autoClose) {
            var display = display || 'block';
            var autoClose = autoClose || false;
            waiting = waiting || '正在加载...';
            if (display == 'block') {
                $.DIC.dialog({id:'loading',content:waiting,noMask:true, autoClose:autoClose});
            } else {
                $.DIC.dialog({id:'loading'});
            }
        },
        ajax: function(url, data, opts) {
            var opts = opts || {};
            var loadingTimer = '';
            url = url.indexOf('?') === -1 ? url + '?' : url + '&';
            url = url.replace(/\&resType\=[^\&]+/g, '') + 'resType=json';
            url = url.replace(/\&isAjax\=1/g, '') + '&isAjax=1';
            var ajaxOpts = {
                url: url,
                data: data,
                cache: opts.cache || false,  // false不缓存请求
                processData: opts.isUpload,
                contentType: opts.isUpload ? false : 'application/x-www-form-urlencoded',
                type: data ? 'POST' : 'GET',
                dataType: opts.dataType || 'json',
                timeout: opts.timeout || 30000,
                jsonp: opts.dataType === 'jsonp' ? 'callback' : null,
                jsonpCallback: opts.dataType === 'jsonp' ? opts.success : null,
                beforeSend: function(XHR, option) {
                    if (opts.requestIndex) {
                        if (opts.requestMode == 'block') {
                            if ($.ajax._requestCache[opts.requestIndex]) {
                                return false;
                            }
                        } else if (opts.requestMode == 'abort') {
                            if ($.ajax._requestCache[opts.requestIndex]) {
                                $.ajax._requestCache[opts.requestIndex].abort();
                            }
                        }
                    }

                    var result = true;
                    if (typeof opts.beforeSend == 'function') {
                        result = opts.beforeSend(XHR, option);
                    }

                    if (result) {
                        $.ajax._requestCache[opts.requestIndex] = XHR;
                        if (!opts.noShowLoading) {
                            loadingTimer = setTimeout(function() {
                                $.DIC.showLoading();
                            }, 100);
                        }
                    }

                    return result;
                },
                // 整个请求完整之后的回调
                complete: function(XHR, status) {
                    if ($.ajax._requestCache[opts.requestIndex]) {
                        $.ajax._requestCache[opts.requestIndex] = null;
                    }
                    if (typeof opts.complete == 'function') {
                        opts.complete(XHR, status);
                    }
                },
                // 请求成功回调
                success: function(result, textStatus, c) {
                    clearTimeout(loadingTimer);
                    $.DIC.showLoading('none');

                    if (result == null && !opts.noMsg) {
                        $.DIC.dialog({content:'您的网络有些问题，请稍后再试 [code:1]', autoClose:true});
                    }

                    if (typeof result !== 'object') {
                        result = $.parseJSON(result);
                    }

                    if (typeof opts.success == 'function') {
                        opts.success(result, textStatus, opts);
                    }

                    if (result.errCode == 0) {
                        if (!opts.noMsg) {
                            $.DIC.dialog({content:result.message, icon:'success', autoClose:true});
                        }

                        if (!opts.noJump && result.jumpURL) {
                            var locationTime = result.locationTime || 2000;
                            $.DIC.reload(result.jumpURL, locationTime);
                        }
                    } else if (result.errCode) {
                        if (!opts.noMsg) {
                            var msg = result.message + '<span style="display:none;">' + result.errCode + '</span>';
                            $.DIC.dialog({content:msg, autoClose:true});
                        }
                    } else {
                        if (!opts.noMsg) {
                            $.DIC.dialog({content:'数据解析失败，请稍后再试 [code:2]', autoClose:true});
                        }
                    }
                },
                // 出错的调用
                error: function(XHR, info, errorThrown) {
                    clearTimeout(loadingTimer);
                    $.DIC.showLoading('none');

                    if (XHR.readyState == 0 || XHR.status == 0) {
                        return false;
                    } else if (info != 'abort' && !opts.noMsg) {
                        if (!opts.noMsg) {
                            var msg = '';
                            switch (info) {
                                case 'timeout':
                                    msg = '对不起，请求服务器网络超时';
                                    break;
                                case 'error':
                                    msg = '网络出现异常，请求服务器错误';
                                    break;
                                case 'parsererror':
                                    msg = '网络出现异常，服务器返回错误';
                                    break;
                                case 'notmodified':
                                default:
                                    msg = '您的网络有些问题，请稍后再试[code:3]';
                            }
                            $.DIC.dialog({content: msg, autoClose:true});
                        }
                    }
                    if (typeof opts.error == 'function') {
                        opts.error();
                    }
                }
            };
            $.ajax(ajaxOpts);

            return false;
        },
        ajaxForm: function(formId, opt, isSubmit) {
            var opt = opt || {};
            var loadingTimer = '';
            var url = opt.url || $('#' + formId).prop('action');
            url = url.indexOf('?') === -1 ? url + '?' : url + '&';
            url = url.replace(/\&resType\=[^\&]+/g, '') + 'resType=json';
            url = url.replace(/\&isAjax\=1/g, '') + '&isAjax=1';
            var formOpt = {
                beforeSubmit: function(formData, jqForm, options) {
                    if ($.ajax._requestCache[formId] == 1) {
                        return false;
                    }

                    var result = true;
                    if (typeof opt.beforeSubmit == 'function') {
                        result = opt.beforeSubmit(formData, jqForm, options, opt);
                    }

                    if (result) {
                        $.ajax._requestCache[formId] = 1;
                        if (!opt.noShowLoading) {
                            loadingTimer = setTimeout(function() {
                                $.DIC.showLoading();
                            }, 100);
                        }
                    }

                    return result;
                },
                success: function(result, statusText) {
                    $.ajax._requestCache[formId] = null;
                    clearTimeout(loadingTimer);
                    $.DIC.showLoading('none');

                    if (result == null && !opt.noMsg) {
                        $.DIC.dialog({content:'您的网络有些问题，请稍后再试 [code:1]', autoClose:true});
                    }

                    if (typeof result !== 'object') {
                        result = $.parseJSON(result);
                    }

                    if (typeof opt.success == 'function') {
                        opt.success(result, statusText, opt);
                    }
                    if (result.errCode == 0) {
                        if (!opt.noMsg) {
                            $.DIC.dialog({content:result.message, icon:'success', autoClose:true});
                        }

                        if (!opt.noJump && result.jumpURL) {
                            var locationTime = result.locationTime || 2000;
                            $.DIC.reload(result.jumpURL, locationTime);
                        }
                    } else if (result.errCode) {
                        if (!opt.noMsg) {
                            var msg = result.message + '<span style="display:none;">' + result.errCode + '</span>';
                            $.DIC.dialog({content:msg, autoClose:true});
                        }
                    } else {
                        if (!opt.noMsg) {
                            $.DIC.dialog({content:'数据解析失败，请稍后再试 [code:2]', autoClose:true});
                        }
                    }
                },
                url: url,
                clearForm: opt.clearForm,
                resetForm: opt.resetForm,
                timeout: opt.timeout || 15000,
                dataType: opt.dataType || 'json',
                error: function(XHR, info, errorThrown) {
                    $.ajax._requestCache[formId] = null;
                    clearTimeout(loadingTimer);
                    $.DIC.showLoading('none');
                    if (!opt.noMsg) {
                        var msg = '';
                        switch (info) {
                            case 'timeout':
                                msg = '对不起，请求服务器超时';
                                break;
                            case 'error':
                                msg = '网络出现异常，请求服务器错误';
                                break;
                            case 'parsererror':
                                msg = '网络出现异常，服务器返回错误';
                                break;
                            case 'notmodified':
                            default:
                                msg = '您的网络有些问题，请稍后再试[code:3]';
                        }
                        $.DIC.dialog({content: msg, autoClose:true});
                    }
                    if (typeof opt.error == 'function') {
                            opt.error(info);
                    }
                }
            };
            isSubmit = isSubmit || false;
            if (isSubmit) {
                $('#' + formId).ajaxSubmit(formOpt);
            } else {
                $('#' + formId).ajaxForm(formOpt);
            }
            return false;
        },
        // 统一触摸态
        touchState: function(rule, style, containerRule)  {
            style = style || 'commBg';
            containerRule = containerRule || '';
            if (containerRule) {
                jq(containerRule).on('tap', rule, function() {
                    obj = jq(this);
                    obj.addClass(style);
                    setTimeout(function() {
                        obj.removeClass(style);
                    }, 200);
                });

            } else {
                jq(rule).on('tap', function() {
                    obj = jq(this);
                    obj.addClass(style);
                    setTimeout(function() {
                        obj.removeClass(style);
                    }, 200);
                });
            }
        },
        // 为了避免 tap 与 a 标签冲突的情况出现，使用此种方式
        handleLink: function(rule, containerRule) {
            containerRule = containerRule || '';
            if (containerRule) {
                jq(containerRule).on('tap', rule, function(e) {
                    e.preventDefault();
                    var link = jq(this).attr('_href');
                    $.DIC.reload(link);
                });
            } else {
                jq(rule).on('tap', function(e) {
                    e.preventDefault();
                    var link = jq(this).attr('_href');
                    $.DIC.reload(link);
                });
            }
        }
    }
});

$.os = {};
$.os.ios = false;
$.os.android = false;
$.os.version = false;

(function() {
    var ua = navigator.userAgent;
    var browser = {},
        weixin = ua.match(/MicroMessenger\/([^\s]+)/),
        webkit = ua.match(/WebKit\/([\d.]+)/),
        android = ua.match(/(Android)\s+([\d.]+)/),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod).*OS\s([\d_]+)/),
        iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/),
        chrome = ua.match(/CriOS\/([\d.]+)/),
        opera = ua.match(/Opera\/([\d.]+)/),
        safari = ua.match(/Safari\/([\d.]+)/);
    if (weixin) {
       $.os.wx = true;
       $.os.wxVersion = weixin[1];
    }
    // if (browser.webkit = !! webkit) browser.version = webkit[1]
    if (android) {
        $.os.android = true;
        $.os.version = android[2];
    }
    if (iphone) {
        $.os.ios = $.os.iphone = true;
        $.os.version = iphone[2].replace(/_/g, '.');
    }
    if (ipad) {
        $.os.ios = $.os.ipad = true;
        $.os.version = ipad[2].replace(/_/g, '.');
    }
    if (ipod) {
        $.os.ios = $.os.ipod = true;
        $.os.version = ipod[2].replace(/_/g, '.');
    }
    window.htmlEncode = function(text) {
        return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    window.htmlDecode = function(text) {
        return text.replace(/&amp;/g, '&').replace(/&quot;/g, '/"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    // 网络类型定义
    window.NETTYPE = 0;
    window.NETTYPE_FAIL = -1;
    window.NETTYPE_WIFI = 1;
    window.NETTYPE_EDGE = 2;
    window.NETTYPE_3G = 3;
    window.NETTYPE_DEFAULT = 0;
})();
