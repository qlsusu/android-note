//blog 12.05
var cloudad_type = 'ibm425';
var cloudad_urls = [
'http://ad.csdn.net/adsrc/ibm-caq4-eis-serverhomepage-960-90-1102.swf'
];
var cloudad_clks = [
'http://e.cn.miaozhen.com/r.gif?k=1003524&p=3y2u20&rt=2&o=http://ad-apac.doubleclick.net/click;h=v2|3FEA|0|0|%2a|h;264138153;0-0;0;89741277;31-1|1;50977344|50947757|1;;%3fhttp://www.ibm.com/systems/cn/ads/2012q4_flexsystem.shtml?csr=apch_cfg4_20121019_1350631108800&ck=csdn&cmp=245ff&ct=245ff07w&cr=csdn&cm=b&csot=-&ccy=cn&cpb=-&cd=2012-10-17&cot=a&cpg=off&cn=intel_rebate_flex_system_(eis)&csz=960*90'
];

var can_swf = (function () {
    if (document.all) swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    else if (navigator.plugins) swf = navigator.plugins["Shockwave Flash"];
    return !!swf;
})();

function cloudad_show() {
    var rd = Math.random();
    var ad_url, log_url;
    if (rd < 0.4 && can_swf) {
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
