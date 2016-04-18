jQuery(document).ready(function()
{	

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


function ajuster_taille_composants()
{	
	//$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	$('#page_content').css('height','auto');
	$("#div_map_and_products").css('height',$( window ).height()
		-$('header').height()
		-$('#bandeau_goToFournisseurList:visible').outerHeight(true));
	ajuster_taille_carte();
}

function ajuster_taille_carte(bandeau_detail_height = $('#bandeau_detail').height())
{	
	/*window.console.log('taille carte: detail -> ' + bandeau_detail_height);*/
	$("#map").css('height',$("#section_carte").height()-bandeau_detail_height);
}





