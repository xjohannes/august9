module.exports = function() {
	$(window).scroll(function() {
		if ($(this).scrollTop() > 1){  
		    $('header').addClass("shrink_header");
		  }
		  else{
		    $('header').removeClass("shrink_header");
		  }
});
}