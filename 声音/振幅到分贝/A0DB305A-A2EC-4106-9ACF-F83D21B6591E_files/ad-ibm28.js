//bbs 9.30
var cloudad_type = 'ibm28';
var cloudad_urls = [
'http://ad.csdn.net/adsrc/university-of-bari-bbs-homepag-760-90-0823.swf'
];
var cloudad_clks = [
'http://e.cn.miaozhen.com/r.gif?k=1002333&p=3xyEE0&o=http://www-31.ibm.com/ibm/cn/cloud/solution/bari/index.shtml?csr=apch_cyl3_20120801_1343793341976&ck=csdn&cmp=215tg&ct=215tg23w&cr=csdn&cm=b&csot=-&ccy=cn&cpb=-&cd=2012-07-31&cot=a&cpg=tcny&cn=university_of_bari&csz=760*90'
];

var can_swf = (function () {
    if (document.all) swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    else if (navigator.plugins) swf = navigator.plugins["Shockwave Flash"];
    return !!swf;
})();

function cloudad_show() {
    var rd = Math.random();
    var ad_url, log_url;
    if (rd < 1.6 && can_swf) {
        ad_url = cloudad_urls[0];

        log_url = 'http://ad.csdn.net/log.ashx';
        log_url += '?t=view&adtype=' + cloudad_type + '&adurl=' + encodeURIComponent(ad_url);
        cloudad_doRequest(log_url, true);
    }
    if (rd < 0.003) {
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
