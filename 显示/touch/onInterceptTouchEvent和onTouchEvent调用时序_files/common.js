function setCookie(name, value, days) {
    document.cookie = name + "=" + escape(value) + (days ? "; expires=" + new Date(new Date().getTime() +
		days * 24 * 60 * 60 * 1000).toGMTString() : "");
}

function getCookie(name) {
    var re = new RegExp("(^|;)\\s*(" + name + ")=([^;]*)(;|$)", "i");
    var res = re.exec(document.cookie);
    return res != null ? unescape(res[3]) : null;
}

function DisplayWelcomeBar() {
    var username = getCookie("UserName");
    var isGuest = !username || /^guest$/i.test(username);
    if (isGuest) {
        $("li:has(#a_welcome,#a_exit,#a_myblog,#a_configure,#a_postedit,#a_postlist)").hide();
        $("#a_login,#a_register").parent().show();
        $("#a_login").attr("href", "http://passport.csdn.net/UserLogin.aspx?from=" +
			encodeURIComponent(("" + document.location).replace(/(.*?)#(.*?)$/, "$1")));
    } else {
        $("#a_login,#a_register").parent().hide();
        $("li:has(#a_welcome,#a_exit,#a_myblog,#a_configure,#a_postedit,#a_postlist)").show();
        $("#a_welcome")
			.html("欢迎&nbsp;" + username + "!")
			.attr("href", "http://hi.csdn.net/" + username);
        $("#a_myblog").attr("href", "http://blog.csdn.net/" + username);
        if (CurrentUserName.toLowerCase() == username.toLowerCase()) { // 自己的文章
            $("span:has(.a_edit)").show();
        }
    }
}
$(document).ready(function () {
    $("#inputSearch").keyup(function (event) {
        switch (event.keyCode) {
            case 13:
                $("#buttonSearch").click();
                return false;
        }
        return true;
    });
    $("#buttonSearch").click(function () {
        var searchScope = $("#Search_ddlSearchScope").val();
        var searchText = $("#inputSearch").val();
        if (searchText) {
            var searchUri = "http://so.csdn.net/search?t=blog&q=";
            if (searchScope != "all")
                searchUri += "blog:" + encodeURIComponent(searchScope) + " ";
            searchUri += encodeURIComponent(searchText);

            window.open(searchUri);
        }
        return false;
    });

    DisplayWelcomeBar();

    $("#a_comment").click(function () {
        $("#content").each(function () {
            this.focus();
            return false;
        });
        return false;
    });
    var username = getCookie("UserName");
    $.getJSON("/!handler/UserInfoHandler.ashx?jsoncallback=?&username=" + CurrentUserName + "&visitor=" + username, function (data) {
        $("#userInfo").replaceWith(data);
        $("#csdnblog_sidebar dt").css("text-align", "left");
        $("#csdnblog_sidebar dd:not(.middle)").css("text-align", "left");
    });
});