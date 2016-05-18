function myRTrim(str, trimStr)
{
var s = new String(str);
if (trimStr.indexOf(s.charAt(s.length-1)) != -1)
{
var i = s.length - 1;
while (i >= 0 && trimStr.indexOf(s.charAt(i)) != -1){i--;}
s = s.substring(0, i+1);
}
return s;
}
var _FeedbackCountStack = "";
var _FeedbackCountResult = "";

function AddFeedbackCountStack(ID)
{
_FeedbackCountStack += ID + ",";
}
function LoadFeedbackCount()
{
    var url = "http://comments.blog.csdn.net/NewCount.aspx?FeedbackCountStack=" + _FeedbackCountStack + "&jsoncallback=?";
    $.getJSON(url,function(data){
        _FeedbackCountResult = data;
        FillFeedbackCount();
    });
}
function FillFeedbackCount()
{
if(_FeedbackCountResult == null || _FeedbackCountResult == "")
return;

var myFeedbackResultArray = _FeedbackCountResult.split(",");
var TmpResult;

for(var i=0; i<myFeedbackResultArray.length; i++)
{
TmpResult = myFeedbackResultArray[i].split("=");
document.getElementById("FeedbackCount_" + TmpResult[0]).innerHTML = TmpResult[1];
}
}
function checkNull()
{
var searchScope = document.getElementById('Search_ddlSearchScope').value;
var searchText = document.getElementById('inputSearch').value;
if(searchText!='')
{
    var searchUri = "http://so.csdn.net/BlogSearchResult.aspx?q=" + searchText; ;
if(searchScope != 'all')
searchUri = searchUri + " username:"+searchScope;

window.open(searchUri);
}
return false;

}
function keyb(evt)
{

var eve = evt==null?window.event:evt;
if (eve.keyCode==13)
{
checkNull();
return false;
}
else return true;
}