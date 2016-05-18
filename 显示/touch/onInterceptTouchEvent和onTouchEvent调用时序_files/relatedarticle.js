$(document).ready(function() {
    LoadRelatedArticle(CurrentEntryId)
});

var Uri_RelatedArticleHandler = "/!handler/RelatedArticleHandler.ashx?jsoncallback=?&{0}";
var Item_dt = "<dd><span><a onclick=\"LogClickCount(this,183)\" href=\"{1}\" target=\"_blank\">{0}</a></span></dd>";

function LoadRelatedArticle(articleId) {
    var queryString = "articleId=" + articleId;
    $.getJSON(Uri_RelatedArticleHandler.format(queryString), function(data) {
        if (data == "null") {
            return;
        }
        $.each(data, function(i, item) {
            $(".mutualitys").find("dl").append(Item_dt.format(item.Title, item.Url));
        });
        $(".mutualitys").show();
        LogClickCount(this, 184);
    });
}

String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}