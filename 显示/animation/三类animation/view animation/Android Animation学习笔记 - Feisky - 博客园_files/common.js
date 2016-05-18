
function WarpClass(eID,tID,fID,ev)
{var eObj=document.getElementById(eID);var tObj=document.getElementById(tID);var fObj=document.getElementById(fID);if(eObj&&tObj)
{if(!tObj.style.display||tObj.style.display=="block")
{tObj.style.display="none";eObj.className="Warp";if(fObj)
{fObj.style.display="none";}}
else
{tObj.style.display="block";eObj.className="UnWarp";if(ev)
{eval(ev);}
if(fObj)
{fObj.style.display="block";}}}}
function PutInWz(){var width=480;var height=480;var leftVal=(screen.width-width)/2;var topVal=(screen.height-height)/2;var d=document;var t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');window.open('http://wz.cnblogs.com/create?t='+escape(d.title)+'&u='+escape(d.location.href)+'&c='+
escape(t)+'&i=0','_blank','width='+width+',height='+height+',toolbars=0,resizable=1,left='+leftVal+',top='+topVal);}
function AddToWz(entryId){var width=480;var height=480;var leftVal=(screen.width-width)/2;var topVal=(screen.height-height)/2;var d=document;var t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');window.open('http://wz.cnblogs.com/create?t='+escape(d.title)+'&u='+escape(d.location.href)+'&c='+
escape(t)+'&bid='+entryId+'&i=0','_blank','width='+width+',height='+height+',toolbars=0,resizable=1,left='+leftVal+',top='+topVal);}
function GetMeta(ametaName){var METAs=document.getElementsByTagName("meta");for(var i=0;i<METAs.length;i++){if(METAs[i].name.toLowerCase()==ametaName){return(METAs[i].content);}};return"";}
function AjaxPost(url,postData,successFunc){$.ajax({url:url,data:postData,type:'post',dataType:'json',contentType:'application/json; charset=utf8',success:function(data){successFunc(data.d);},error:function(xhr){}});}
var currentDiggType;var currentDiggEntryId;function DiggIt(entryId,blogId,diggType){currentDiggEntryId=entryId;var diggedType=$("#span_isdigged_"+currentDiggEntryId).html();if(diggedType==0){ShowDiggMsg('提交中...');currentDiggType=diggType;AjaxPost("/ws/digg.asmx/digg",'{entryId:'+entryId+',blogId:'+blogId+',diggType:'+diggType+'}',OnDiggSuccess);}
else if(diggedType==1){ShowDiggMsg('您已经推荐过了！');}
else if(diggedType==2){ShowDiggMsg('您已经反对过了！');}}
function OnDiggSuccess(response){if(response==-1){location.href="http://passport.cnblogs.com/login.aspx?ReturnUrl="+location.href;}
else if(response==-2){ShowDiggMsg("您已经评价过该文章！");}
else if(response==0){ShowDiggMsg('操作失败，请与管理员联系！');}
else{if(currentDiggType==1){$("#digg_count_"+currentDiggEntryId).html(parseInt($("#digg_count_"+currentDiggEntryId).html())+1);}
else if(currentDiggType==2){$("#bury_count_"+currentDiggEntryId).html(parseInt($("#bury_count_"+currentDiggEntryId).html())+1);}
ShowDiggMsg("谢谢您的评价！");$("#span_isdigged_"+currentDiggEntryId).html(currentDiggType);}}
function CancelDigg(entryId){if(confirm('确认取消吗？')){currentDiggEntryId=entryId;currentDiggType=$("#span_isdigged_"+entryId).html();if(currentDiggType>0){ShowDiggMsg('操作中...');AjaxPost("/ws/digg.asmx/CancelDigg",'{entryId:'+entryId+',diggType:'+currentDiggType+'}',OnCancelDiggSuccess);}}}
function OnCancelDiggSuccess(response){if(currentDiggType==1){$("#digg_count_"+currentDiggEntryId).html(parseInt($("#digg_count_"+currentDiggEntryId).html())-1);}
else if(currentDiggType==2){$("#bury_count_"+currentDiggEntryId).html(parseInt($("#bury_count_"+currentDiggEntryId).html())-1);}
ShowDiggMsg("取消成功！");$("#span_isdigged_"+currentDiggEntryId).html('0');}
function ShowDiggMsg(msg){$("#digg_word_"+currentDiggEntryId).css("color","red");$("#digg_word_"+currentDiggEntryId).html(msg);}
function hide_links(){document.getElementById('mini_nav_more').style.display='none';document.getElementById('mini_nav_more_link_div').className='mini_nav_more_link_hide';}
function show_links(){document.getElementById('mini_nav_more').style.display='block';document.getElementById('mini_nav_more_link_div').className='mini_nav_more_link';}
function clt_enter(event){if(event.ctrlKey&&event.keyCode==13){PostComment();return false;}
else{return true;}}
function ShowCommentMsg(msg){$("#tip_comment").html(msg);}
function BindComment(commentId){$("#comment_edit_id").html(commentId);ShowCommentMsg("评论内容加载中...");AjaxPost('/ws/CommentService.asmx/GetCommentBody','{commentId:'+commentId+'}',OnBindComment);}
function OnBindComment(reponse){if(reponse==''){$("#comment_edit_id").html('');}
else{var content=reponse.replace(/<br>|<br\/>/gi,"\n");$("#tbCommentBody").val(content);ShowCommentMsg('');$("#btn_comment_submit").val("修改");$("#span_comment_canceledit").css("display","inline");}}
function CancelCommentEdit(){if(confirm('确认取消修改吗？')){ResetCommentBox();}}
function ResetCommentBox(){$("#btn_comment_submit").val("提交");$("#comment_edit_id").html('');$("#span_comment_canceledit").css("display","none");$("#tbCommentBody").val('');}
function UpdateComment(blogId){var comment={};comment.commentId=$("#comment_edit_id").html();comment.parentId=$("#span_parent_id").html();comment.content=$("#tbCommentBody").val();comment.blogId=blogId;AjaxPost('/ws/CommentService.asmx/UpdateComment',$.toJSON(comment),OnUpdateComment);}
function OnUpdateComment(response){if(response){var commentId=$("#comment_edit_id").html();var content=$("#tbCommentBody").val();content=escapeHTML(content);content=content.replace(/\n/g,"<br/>");content=content.replace(/\[quote\]/g,"<fieldset class=\"comment_quote\"><legend>引用</legend>");content=content.replace(/\[\/quote\]/g,"</fieldset>");$("#comment_body_"+commentId).html(content+" <span style='color:red'>修改成功！</span>");var url=location.href;if(url.indexOf("#")>0){url=url.substring(0,url.indexOf("#"));}
location.href=url+"#"+commentId;ResetCommentBox();ShowCommentMsg("修改成功！");}
else{alert("修改失败！");}}
function QuoteComment(commentId,replyTo){$("#span_parentcomment_id").html(commentId);$("#span_comment_replyto").html(replyTo);GetQuoteComment(commentId);}
function GetQuoteComment(commentId){ShowCommentMsg("引用内容加载中...");AjaxPost('/ws/CommentService.asmx/GetQuoteComment','{commentId:'+commentId+'}',OnGetQuoteComment);}
function OnGetQuoteComment(response){var content=response;if(content.length>500){content=content.substring(0,300)+"...";}
$("#tbCommentBody").focus();$("#tbCommentBody").val($("#tbCommentBody").val()+"[quote]"+content+"[/quote]"+"\n");ShowCommentMsg('');}
function ReplyComment(author,commentId,replyTo){$("#tbCommentBody").focus();$("#tbCommentBody").val("@"+author+"\n"+$("#tbCommentBody").val());$("#span_parentcomment_id").html(commentId);$("#span_comment_replyto").html(replyTo);}
function CommentNotify(commentId){var replyto=$("#span_comment_replyto").html();$.ajax({url:'/ws/CommentService.asmx/SendCommentNotify',data:'{id:"'+replyto+'",commentId:'+commentId+'}',type:"post",dataType:"json",contentType:"application/json; charset=utf8",error:function(xhr){alert(xhr.responseText);}});}
var currentDelElement;var currentCommentID;function DelComment(id,element){if(confirm("确认要删除该评论吗?")){currentDelElement=element;currentCommentID=id;$(currentDelElement).html("<span style='color:red'>正在删除...</span>");$(currentDelElement).removeAttr("href");$(currentDelElement).removeAttr("onclick");AjaxPost("/ws/CommentService.asmx/DeleteComment",'{commentId:'+id+'}',OnDelComment);}
return false;}
function OnDelComment(response){if(response){$("#comment_body_"+currentCommentID).html('');if(document.getElementById("comment_anchor_"+currentCommentID)!=null){document.getElementById("comment_anchor_"+currentCommentID).parentNode.innerHTML='';}
if(currentDelElement.parentNode!=null){currentDelElement.parentNode.innerHTML="<span style='color:red'>删除成功!</span>";}}
else{alert('删除失败！');}}
function InsertCodeToEditor(code){$("#tbCommentBody").val($("#tbCommentBody").val()+code);}
function RefreshPage(){location.reload();return false;}
function RefreshCommentList(parentId){$("#span_refresh_tips").show();$("#span_refresh_tips").html("正在刷新...");$("#span_refresh_tips").css("color","red");$("#lnk_RefreshComments").hide();var startId=$("#span_comment_maxid").html();if(!startId)startId=0;AjaxPost('/ws/CommentService.asmx/GetNewComments','{parentId:'+parentId+',startId:'+startId+'}',OnRefreshCommentList);return false;}
function OnRefreshCommentList(response){if(response==''){$("#divCommentShow").html("<div style=\"color:red;padding:5px;\">暂无新评论，"+new Date()+"</div>");}
else{$("#divCommentShow").html(response);}
$("#span_refresh_tips").hide();$("#lnk_RefreshComments").show();}
function RereshComments2(parentId){$("#divCommentShow").html($("#divCommentShow").html()+"<span style='color:red'>评论提交成功！<br/>正在更新评论列表...</span>");var startId=$("#span_comment_maxid").html();if(!startId)startId=0;AjaxPost('/ws/CommentService.asmx/GetNewComments','{parentId:'+parentId+',startId:'+startId+'}',OnRefreshComments2);return false;}
function OnRefreshComments2(response){$("#divCommentShow").html(response);}
function AddParamToUrl(url,paramName,paramValue){var index=url.indexOf('?');if(index>0){url=url.substring(0,index);}
return url+"?"+paramName+"="+paramValue;}
$.fn.extend({selection:function(){var txt='';var doc=this.get(0).document;if(doc){var sel=doc.selection.createRange();if(sel.text.length>0)
txt=sel.text;}
else if(this.get(0).selectionStart||this.get(0).selectionStart=='0'){var s=this.get(0).selectionStart;var e=this.get(0).selectionEnd;if(s!=e){txt=this.get(0).value.substring(s,e);}}
return $.trim(txt);},parseHtml:function(t){var doc=this.get(0).document;if(doc){this.get(0).focus();doc.selection.createRange().collapse;this.get(0).document.selection.createRange().text=t;}
else if(this.get(0).selectionStart||this.get(0).selectionStart=='0'){var s=this.get(0).selectionStart;var e=this.get(0).selectionEnd;var val=this.get(0).value;var start=val.substring(0,s);var end=val.substring(e);this.get(0).value=start+t+end;}}})
var insertUBB=function(id,html){var val=$('#'+id).selection();if(val==''){alert('请选择文字');}
else{var end=html;if(html.indexOf('=')>=0)
end=html.substring(0,html.indexOf('='));$('#'+id).parseHtml('['+html+']'+val+'[/'+end+']');}}
function insertIndent(id){var val=$('#'+id).selection();if(val==''){$('#'+id).parseHtml("　　");}
else{$('#'+id).parseHtml("　　"+val);}}
function insertUbbUrl(id){var p1=prompt("显示链接的文本.\n如果为空，那么将只显示超级链接地址","");if(p1!=null){var p2=prompt("http:// 超级链接","http://");if(p2!=''&&p2!='http://'){if(p1!=''){$('#'+id).parseHtml('[url='+p2+']'+p1+'[/url]');}
else{$('#'+id).parseHtml('[url]'+p2+'[/url]');}}}}
function insertUbbImg(id){var p=prompt('请先将图片上传到您的图库中，然后将图片地址拷下粘贴在此：','http://');if(p==null||$.trim(p)==''||p.toLowerCase()=='http://')
return;$('#'+id).parseHtml('[img]'+p+'[/img]');}
function insertUbbCode(){var c_width=450;var c_height=400;var leftVal=(screen.width-c_width)/2;var topVal=(screen.height-c_height)/2;var codeWindow=window.open('/SyntaxHighlighter.aspx','_blank','width='+c_width+',height='+c_height+',toolbars=0,resizable=1,left='+leftVal+',top='+topVal);codeWindow.focus();}
function escapeHTML(str){var div=document.createElement('div');var text=document.createTextNode(str);div.appendChild(text);return div.innerHTML;}
function GetRecentIng(spaceUserId){$.ajax({url:'/WS/PublicUserService.asmx/GetIngList',data:'{spaceUserId:'+spaceUserId+'}',type:'post',dataType:'json',contentType:'application/json; charset=utf-8',cache:false,success:function(data){$("#author_profile_ing").html(data.d);},error:function(xhr){$("#author_profile_ing").html("读取闪存出错："+xhr.responseText);}});}
function cnblogs_code_collapse(element){if(element.children('div.cnblogs_code_open').css('display')!='none'){element.children('div.cnblogs_code_open').css('display','none');element.children('img.code_img_opened').css('display','none');element.children('img.code_img_closed').css('display','inline');}
else{element.children('div.cnblogs_code_open').css('display','block');element.children('img.code_img_opened').css('display','inline');element.children('img.code_img_closed').css('display','none');}}
function cnblogs_code_show(id){if($('#cnblogs_code_open_'+id).css('display')=='none'){$('#cnblogs_code_open_'+id).show();$('#code_img_opened_'+id).show();$('#code_img_closed_'+id).hide();}}
function cnblogs_code_hide(id,event){if($('#cnblogs_code_open_'+id).css('display')!='none'){$('#cnblogs_code_open_'+id).hide();$('#code_img_opened_'+id).hide();$('#code_img_closed_'+id).show();if(event.stopPropagation){event.stopPropagation();}
else if(window.event){window.event.cancelBubble=true;}}}
function zzk_go()
{var keystr=encodeURIComponent("blog:"+blogapp+" "+document.getElementById('q').value);window.location="http://zzk.cnblogs.com/s?w="+keystr;}
function zzk_go_enter(event)
{if(event.keyCode==13)
{zzk_go();return false;}}
function google_go(){var keystr=encodeURIComponent("site:www.cnblogs.com/"+blogapp+"/ "+document.getElementById('google_q').value);window.location="http://www.cnblogs.com/search.aspx?keyword="+keystr;}
function google_go_enter(event){if(event.keyCode==13){google_go();return false;}}
function open_link(url){window.open(url);return false;}
function GetJobList(){try{$("#job_list").html('数据加载中...');$.ajax({url:'/ws/BlogAjaxService.asmx/GetJobList',data:'{}',type:'post',dataType:'json',contentType:'application/json; charset=utf8',success:function(data){$("#job_list").html(data.d);}});}catch(e){}}
function login(){location.href="http://passport.cnblogs.com/login.aspx?ReturnUrl="+location.href;}
var c_has_follwed=false;function GetFollowAction(){if(cb_c_u_id==''||cb_blog_uid=='')return;$.ajax({url:'/WS/UserFollow.asmx/GetRelation',data:'{sourceUserId:"'+cb_c_u_id+'",targetUserId:"'+cb_blog_uid+'"}',type:'post',dataType:'json',contentType:'application/json; charset=utf-8',cache:false,success:function(data){if(data.d==0||data.d==2){$("#author_profile_follow").html("<a href=\"javascript:void(0);\" onclick=\"c_follow();return false;\">关注博主</a>");c_has_follwed=false;}
if(data.d&1==1){$("#author_profile_follow").html("我在关注他 <a href=\"javascript:void(0);\" onclick=\"remove_follow();\">取消关注</a>");c_has_follwed=true;}}});}
function c_follow(){if(c_has_follwed){alert("你已经关注过该博主！");return;}
if(!confirm("您确定要关注该博主吗？关注之后，就可以方便地看到他的博客了:)"))
return;$("#author_profile_follow").html("<span class='color:red'>正在处理中...</span>");$.ajax({url:'/ws/UserFollow.asmx/FollowUser',data:'{targetUserId:"'+cb_blog_uid+'"}',type:'post',dataType:'json',contentType:'application/json; charset=utf-8',cache:false,success:function(data){if(data.d){show_follow_msg("关注成功！");}
else{show_follow_msg("添加关注失败，请联系管理员。");}},error:function(xhr){show_follow_msg("发生了错误："+xhr.responseText);}});}
function remove_follow(){if(!confirm("您确定要取消关注吗？"))
return;$("#author_profile_follow").html("<span style='color:red'>正在处理中...</span>");$.ajax({url:'/ws/UserFollow.asmx/RemoveFollow',data:'{targetUserId:"'+cb_blog_uid+'"}',type:'post',dataType:'json',contentType:'application/json; charset=utf-8',cache:false,success:function(data){if(data.d){show_follow_msg('成功取消关注。');}
else{show_follow_msg("取消关注失败，请联系管理员。");}},error:function(xhr){show_follow_msg("发生了错误："+xhr.responseText);}});}
function show_follow_msg(msg){$("#author_profile_follow").html('<span style="color:red">'+msg+'</span>');}