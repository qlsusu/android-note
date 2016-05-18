jQuery(document).ready(function ($) {
    function gravatar(email) {
        return 'http://www.gravatar.com/avatar/' + $.md5(email);
    }

    $('#email').blur(function () {
    	
    	var size = "96";
    	
        var email = $(this).val().toLowerCase();
        if (email.indexOf('@') == -1) { return; }
        var img = new Image();
        $(img)
            .load(function() {
                $('#gravbox').html("<div class='gravatar_frame'><img class='gravatar' src='"+gravatar(email)+"?s="+size+"&d=404' /></div>");
            })
             .error(function() {
                $('#gravbox').html("<p class='nogravatar'>No gravatar? <a href='http://en.gravatar.com/site/signup/"+email+"'>Get one!</a></p>");
            })
             .attr('src',gravatar(email)+"?s="+size+"&d=404"); 
    });
});
