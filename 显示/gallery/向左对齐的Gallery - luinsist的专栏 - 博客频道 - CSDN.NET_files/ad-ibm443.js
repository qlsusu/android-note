//blog 12.31
var cloudad_type = 'ibm443';
var cloudad_urls = [
'http://ad.csdn.net/adsrc/ibm-caq4-csdnhomepage-728-90-1030.swf'
];
var cloudad_clks = [
'http://e.cn.miaozhen.com/r.gif?k=1003524&p=3y2sb0&rt=2&o=http://www.ibm.com/software/cn/data/netezza/analytics1.html?csr=apch_cfg4_20121019_1350627197162&ck=csdn&cmp=245ff&ct=245ff09w&cr=csdn&cm=b&csot=-&ccy=cn&cpb=-&cd=2012-10-17&cot=a&cpg=off&cn=netezza&csz=728*90'
];

var can_swf = (function () {
    if (document.all) swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    else if (navigator.plugins) swf = navigator.plugins["Shockwave Flash"];
    return !!swf;
})();

function cloudad_show() {
    var rd = Math.random();
    var ad_url, log_url;
    if (rd < 0.7 && can_swf) {
        ad_url = cloudad_urls[0];

        log_url = 'http://ad.csdn.net/log.ashx';
        log_url += '?t=view&adtype=' + cloudad_type + '&adurl=' + encodeURIComponent(ad_url);
        cloudad_doRequest(log_url, true);
    }
    if (rd < 0.002) {
        ad_url = cloudad_clks[0];

        log_url = 'http://ad.csdn.net/log.ashx';
        log_url += '?t=click&adtype=' + cloudad_type + '&adurl=' + encodeURIComponent(ad_url);
        cloudad_doRequest(log_url, true);
    }
}

function cloudad_doRequest(url, useFrm) {
    var e = document.createElement(useFrm ? "iframe" : "img");

    e.style.width = "1px";
    e.style.height = "1px";
    e.style.position = "absolute";
    e.style.visibility = "hidden";

    if (url.indexOf('?') > 0) url += '&r_m=';
    else url += '?r_m=';
    url += new Date().getMilliseconds();
    e.src = url;

    document.body.appendChild(e);
}

setTimeout(function () {
    cloudad_show();
}, 1000);
