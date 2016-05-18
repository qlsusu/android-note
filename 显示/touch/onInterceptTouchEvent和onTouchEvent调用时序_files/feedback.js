// 辅助方法开始
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    }
    return null;
}

function LoginUserName() {
    return getCookie("UserName");
}

function IsGuest() {
    return !LoginUserName() || LoginUserName() == "Guest";
}

function GetDisplayUserName() {
    var activeUserName = getCookie("UserName");
    if (!activeUserName || activeUserName == "Guest") {
        activeUserName = "匿名用户";
    }
    return activeUserName;
}

function JsonDateTime2String(JsongDateTimeString) {
    var datetimeString = JsongDateTimeString.replace('/', 'new ').replace('/', '');
    datetimeString = '{"DateCreated":' + datetimeString + '}';
    obj = eval('(' + datetimeString + ')');
    datetimeString = obj.DateCreated.toLocaleString();
    return datetimeString;
}

String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

String.prototype.HtmlEncode = function() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, '<br />').replace(/\r/g, '');
}
// 辅助方法结束

var AnonymousUserName = "匿名用户";
//var AllowAnonymousComment = false; 此变量应该由服务器端输出到页面上

function RefreshCommentLoginStatus() {
    if (IsGuest()) {
        $("#loginTips").show();
        $("#anonymous").parent().hide();
        if (AllowAnonymousComment) {
            $("#imgValidationCode").parents("ul").show();
        }
        else {
            $("#imgValidationCode").parents("ul").hide();
        }
    }
    else {
        $("#loginTips").hide();
        if (AllowAnonymousComment) {
            $("#anonymous").parent().show();
        }
        else {
            $("#anonymous").parent().hide();
        }
        $("#imgValidationCode").parents("ul").hide();
    }
    $('.commentnew').find("#commentUser").text(GetDisplayUserName());
}

function InitEmotions() {
    $(".brow").click(function() {
        var emotionUbbString = "[{0}]".format($(this).attr("src").replace(/\.gif/g, '').replace(/\/images\/emotions\//g, ''));
        $("#content").focus();
        $("#content").val($("#content").val() + emotionUbbString);
    });
}

function Init() {
    RefreshCommentLoginStatus();
    InitEmotions();
    $("#anonymous").click(function() {
        if (this.checked) {
            $("#imgValidationCode").parents("ul").show();
        }
        else {
            $("#imgValidationCode").parents("ul").hide();
        }
        $("#SubmitFeedback").unbind("click");
        if (!AllowAnonymousComment && IsGuest()) {
            $("#SubmitFeedback").bind("click", OpenLoginDialog);
        }
        else {
            $("#SubmitFeedback").bind("click", PostContent);
        }
    });
}

//文档加载完毕，脚本开始
$(document).ready(function() {
    Init();
    LoadFeedback(CurrentEntryId, CurrentUserName);
});


//{0} = 标题
//{1} = 文章链接
//{2} = 评论ID
//{3} = 评论用户名
//{4} = 评论时间
//{5} = 评论IP
//{6} = 评论内容
//{7} = 用户个人空间链接
//{8} = 专家标识
//{9} = 不同回复级别的样式
//{10} = 不同回复级别的头像样式
var commentItem = "<dl class=\"{9}\"><dt><a id=\"{2}\" style=\"display: none\" title=\"permalink: {0}\" href=\"{1}#{2}\"></a><a {7} target=\"_blank\" rel=\"nofollow\">{3}</a>{8}&nbsp;发表于{4}&nbsp;&nbsp;<span style='display:none;'>IP:{5}</span><a href=\"mailto:webmaster@csdn.net?subject=Comment Report!!!&body=Author:{3} URL:{1}\">举报</a><a href=\"javascript:Reply({2},'{3}')\">回复</a><span class='delete'><a href='javascript:DeleteFeedback({2})'>删除</a></span></dt>"
+"<dd class=\"{10}\"><img height=\"40px\" width=\"40px\" alt=\"\" src=\"{11}\"/></dd><dd>{6}</dd></dl>";
var expertIcon = "<img src=\"http://blog.csdn.net/images/ex.gif\"  alt =\"博客专家\" title=\"博客专家\" style=\"vertical-align:top\":>"

function Emotion2Html(str) {
    return str.replace(/\[(e[0][0-9]|e10)\]/ig, "<img src='http://blog.csdn.net/images/emotions/$1.gif'/>");
}
//拼接一条评论正文Html
function BuildContent(title, sourceUrl, id, author, dateCreated, ip, body, parentId, isExpert, headImg) {
    var userLink;
    if (author == AnonymousUserName) {
        userLink = "";
    }
    else {
        userLink = "href=\"http://hi.csdn.net/{0}\"".format(author);
    }

    return commentItem.format(title, sourceUrl, id, author, dateCreated, ip, Emotion2Html(body), userLink, isExpert ? expertIcon : "", parentId > 0 ? "ask" : "question", parentId > 0 ? "askauthor" : "quesauthor", (headImg ? headImg : "http://avatar.csdn.net/p/" + author + "/2"));

}

function InList(one, List) {
    var result = false;
    $.each(List, function(i, item) {
        if (item == one) {
            result = true;
        }
    });
    return result;
}

var t_CommentHost = "http://comments.blog.csdn.net";
var t_CommentHandler = t_CommentHost + "/feedback.ashx?jsoncallback=?&{0}";
function LoadFeedback(entryId, userName) {
    var queryString = "action=get&entryId=" + entryId + "&userName=" + userName + "&d=" + Math.random();
    $.getJSON(t_CommentHandler.format(queryString), function(data) {
        $.each(data.Items, function(i, item) {
            if (item.parentId <= 0) {
                var html = BuildContent(item._title, item._sourceurl, item._id, item._author, JsonDateTime2String(item._datecreated), item.ipAddress, item._body, item.parentId, InList(item._author, data.Experts), item._headImg);
                $('#commentslist').append(html);
            }
        });
        $.each(data.Items, function(i, item) {
            if (item.parentId > 0) {
                var html = BuildContent(item._title, item._sourceurl, item._id, item._author, JsonDateTime2String(item._datecreated), item.ipAddress, item._body, item.parentId, InList(item._author, data.Experts), item._headImg);
                var prvItem = $('#' + item.parentId).parent().parent();
                while (prvItem.next(".ask").length > 0) {
                    prvItem = prvItem.next(".ask");
                }
                prvItem.after(html);
            }
        });
        LoadReply(entryId, userName);

        $("#SubmitFeedback").unbind("click");
        if (!AllowAnonymousComment && IsGuest()) {
            $("#SubmitFeedback").bind("click", OpenLoginDialog);
        }
        else {
            $("#SubmitFeedback").bind("click", PostContent);
        }
    });
}

var Reply2ParentId;
var Reply2UserName;
function Reply(reply2ParentId, reply2UserName) {
    Reply2ParentId = reply2ParentId;
    Reply2UserName = reply2UserName;
    $("#content").focus();
    var oriContent = $("#content").val().replace(/回复.*?：/i, "");
    $("#content").val("回复 " + reply2UserName + "：" + oriContent);
}

function DeleteFeedback(feedbackId) {
    if (confirm('您确定要删除吗？')) {
        var queryString = "action=ownerdelete&entryId=" + CurrentEntryId + "&commentId=" + feedbackId;
        $.getJSON(t_CommentHandler.format(queryString), function(data) {
            if (data == "OK") {
                $("#" + feedbackId).parent().parent().remove();
            }
        });
    }
}

function HideDeleteBtn() {
    if (IsGuest() || LoginUserName() != CurrentUserName) {
        $(".delete").hide();
    }
}

function LoadReply(entryId, userName) {
    var queryString = "action=getreply&entryId=" + entryId + "&userName=" + userName + "&d=" + Math.random();
    $.getJSON(t_CommentHandler.format(queryString), function(data) {
        $.each(data, function(i, item) {
            var feedbackId = item.FeedbackId;
            var feedbackUser = $('#' + feedbackId).next().text();
            $('#' + feedbackId).parent().parent().after(BuildContent(item.Title, "", item.ReplyId, userName, JsonDateTime2String(item.DateCreated), item.IpAddress, "回复 " + feedbackUser + "：" + item.Body, feedbackId));
        });
        HideDeleteBtn();
    });
}

function GetArticleTitle() {
    var text = $('.title_txt').text();
    for (var i = 0; i < $('.title_txt').children().length; i++) {
        text = text.replace($('.title_txt').children().eq(i).text(), "");
    }
    return $.trim(text.replace(/(^\s*)|(\s*$)/g, ""));
}

function GetArticleUrl() {
    var url = document.URL;
    //去掉url的评论锚点
    if (url.lastIndexOf('#') != -1) {
        url = url.substr(0, url.lastIndexOf('#'));
    }
    return url;
}

function PostContent() {
    var anonymous = $("#anonymous").attr("checked");
    var code = $("#code").val();
    var content = $("#content").val();
    var ownerUserName = CurrentUserName;
    var entryId = CurrentEntryId;
    var title = GetArticleTitle();
    var url = GetArticleUrl();
    var reply2 = /回复.*?：/i.test(content);
    var reply2ParentId = reply2 ? Reply2ParentId : 0;
    var reply2UserName = reply2 ? Reply2UserName : "";

    
    var oriContent = $("#content").val().replace(/回复.*?：/i, "");
    
    var queryString = "action=post&anonymous=" + anonymous + "&url=" + encodeURIComponent(url) + "&entryId=" + entryId + "&reply2ParentId=" + reply2ParentId + "&reply2UserName=" + reply2UserName + "&code=" + code + "&owner=" + ownerUserName + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&d=" + Math.random();

    $("#SubmitFeedback").unbind("click");
    //$("#SubmitFeedback").val("正在提交，请稍候...");
    $.getJSON(t_CommentHandler.format(queryString), function(response) {
        if (response.Status > 0) {
            var html = BuildContent(title, location, response.CommentId, anonymous ? AnonymousUserName : GetDisplayUserName(), new Date().toLocaleString(), response.ClientIp, content.HtmlEncode(), reply2ParentId, response.Status == 2);
            if (reply2ParentId <= 0) {
                $('#commentslist').append(html);
            }
            else {
                var prvItem = $('#' + reply2ParentId).parent().parent();
                while (prvItem.next(".ask").length > 0) {
                    prvItem = prvItem.next(".ask");
                }
                prvItem.after(html);
            }
            HideDeleteBtn();

            $("#content").val("");
            $("#code").val("");
            ChangeIdentifyingCode();
        }
        else {
            alert(response.ErrorMsg);
        }
        $("#SubmitFeedback").bind("click", PostContent);
        //$("#SubmitFeedback").val("提交");
    });
}