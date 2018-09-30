/**
 * Created by jiayi.hu on 5/12/17.
 */

(function(a, e, f, g, b, c, d) {a.ClickiTrackerName = b;
    a[b] = a[b] || function() {(a[b].queue = a[b].queue || []).push(arguments)};
    a[b].start = +new Date; c = e.createElement(f); d = e.getElementsByTagName(f)[0];
    c.async = 1; c.src = g; d.parentNode.insertBefore(c, d)
})(window, document, 'script', ('https:' == document.location.protocol ? 'https://stm-collect' : 'http://stm-cdn') + '.cn.miaozhen.com/clicki.min.js', 'stm_clicki');
stm_clicki('create', 'dc-1122', 'auto');
stm_clicki('send', 'pageview');
