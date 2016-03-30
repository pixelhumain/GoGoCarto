jQuery(document).ready(function()
{	
	initIcons();

	$('.collapsible').collapsible({
      accordion : true 
    });

	//animation pour lien d'ancre dans la page
    $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 2000);
	    return false;  
	}); 

	$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);

	setTimeout(ajuster_taille_composants,50);
	window.onresize = function() 
	{
		ajuster_taille_composants();
	}	
});





