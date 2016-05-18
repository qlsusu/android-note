if(typeof(nId)!=null&&typeof(sColor)!=null&&typeof(nWidth)!=null&&typeof(sText)!=null)
{
document.write(
[
"<style>",
".rssbook{padding:10px 15px;overflow:hidden;zoom:1;background:#f6f6f6;border:3px solid #ddd;}",
".light{background:#f6f6f6;border:3px solid #ddd;}",
".dark{background:#aaa;border:3px solid #666;}",
".mailInput{margin-top:5px;}",
".rssbook .info{color:#666;font-size:12px;}",
".light .info{color:#666;}",
".dark .info{color:#fff;}",
".rssbutton{float:left;border:1px solid #698ab4; -moz-border-radius:3px;border-radius:3px;-webkit-border-radius:3px;}",
".dark .rssbutton{border: 1px solid #585858;}",
".rssbutton input{background: #77a0d1;border: 1px solid #88b3e6; color: #FFFFFF; cursor: pointer;font-weight: bold;width:90px;display:block;height:22px;line-height:22px;*line-height:19px;text-align:center;}",
".dark .rssbutton input{background:#676767;border: 1px solid #777;}",
".rssbutton input:hover{background:#86b4eb;text-decoration:none;}",
".dark .rssbutton input:hover{background:#797979;border: 1px solid #939393;}",
"input.rsstxt{width:100%;height:20px;font-size:14px;padding:2px 3px;-moz-border-radius:3px;border-radius:3px;-webkit-border-radius:3px;border:1px solid #ccc;;border-color:#7c7c7c #c3c3c3 #c3c3c3 #9a9a9a;margin-bottom:5px;}",
".dark input.rsstxt{background:#eee;}",
"</style>",
"<div class=\"rssbook ",sColor,
" \" style=\"width:",nWidth," \"><p class=\"info\">",sText,"</p>",
"<div class=\"mailInput\">",
"<form action=\"http://list.qq.com/cgi-bin/qf_compose_send\" target='_blank' method='post'>",
"<input type=\"hidden\" name=\"t\" value=\"qf_booked_feedback\">",
"<input type=\"hidden\" name=\"id\" value=\"",nId,"\">",
"<input  id=\"to\" name=\"to\" type=\"text\" class=\"rsstxt\" value=\"\"/>",
"<div class=\"rssbutton\"><input type=\"submit\" value=\"¶©ÔÄ\"></div>",
"</form>",
"</div></div>"].join(""));

}
else
{
alert("nId empty");
}
