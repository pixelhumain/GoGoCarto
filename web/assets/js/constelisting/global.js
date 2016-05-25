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

	$('#btn-bandeau-helper-close').click(hideBandeauHelper);

	window.onresize = function() 
	{
		ajuster_taille_composants();
	}	
});

function hideBandeauHelper()
{
	$('#bandeau_helper').slideUp(slideOptions);
}

function ajuster_taille_composants()
{	
	//$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	$('#page_content').css('height','auto');
	$("#div_map_and_products").css('height',$( window ).height()
		-$('header').height()
		-$('#bandeau_goToProviderList:visible').outerHeight(true));

	if ($('#ProviderList').offset().top < 100)
	{
		$('#ProviderList ul').css('height',$('#ProviderList').height() - $('#ProviderList .starRepresentationChoice-helper:visible').outerHeight(true) );
	}
	else
	{
		$('#ProviderList ul').css('height','auto');
	}
	

	if ($('#bandeau_detail').width() < '600')
	{
		$('#bandeau_detail').removeClass("largeWidth");
		$('#bandeau_detail').addClass("smallWidth");
	}
	else
	{
		$('#bandeau_detail').addClass("largeWidth");
		$('#bandeau_detail').removeClass("smallWidth");
	}

	ajuster_taille_carte();
}

function ajuster_taille_carte(bandeau_detail_height = $('#bandeau_detail').height())
{	
	if("matchMedia" in window) {
		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	$("#map").css('height',$("#section_carte").height()-bandeau_detail_height);	
	  	} 
		else 
		{			
		  	$("#map").css('height',$("#section_carte").height());		  	
		}
	}
	
}





