!function(a){a.fn.sorted=function(b){var c={reversed:!1,by:function(a){return a.text()}};return a.extend(c,b),$data=a(this),arr=$data.get(),arr.sort(function(b,d){var e=c.by(a(b)),f=c.by(a(d));return c.reversed?f>e?1:e>f?-1:0:f>e?-1:e>f?1:0}),a(arr)}}(jQuery);