jQuery(document).ready(function()
{	
	$('.collapsible').collapsible({
      accordion : true 
    });

	//animation pour lien d'ancre dans la page
    $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 700);
	    return false;  
	}); 

	/*$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);*/

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
		-$('#bandeau_goToProviderList:visible').outerHeight(true));
	ajuster_taille_carte();
}

function ajuster_taille_carte(bandeau_detail_height = $('#bandeau_detail').height())
{	
	/*window.console.log('taille carte: detail -> ' + bandeau_detail_height);*/
	if("matchMedia" in window) {
		if (window.matchMedia("(max-width: 993px)").matches) 
		{
		  	// Lorsqu'on passe de l'écran large vers medium
		  	if ($('#detail_provider').hasClass('floatRight'))
		  	{
		  		$('#detail_provider').removeClass('floatRight');
		  		$('#bandeau_detail .moreDetails').hide();

				var bandeau_detail_height = $('#detail_provider').height();
				$('#bandeau_detail').css('height', bandeau_detail_height);				
		  	}
		  	else
		  	{
		  		$("#map").css('height',$("#section_carte").height()-bandeau_detail_height);	
		  	}
		  		  	
		} 
		else 
		{
			// Lorsqu'on passe de l'écran medium vers large
		  	if (!$('#detail_provider').hasClass('floatRight'))
		  	{
		  		$('#detail_provider').addClass('floatRight');
		  		$('#detail_provider .moreDetails').show();
				$('#bandeau_detail').css('height','100%');
		  	}
		  	$("#map").css('height',$("#section_carte").height());
		  	
		}
	}
	
}





