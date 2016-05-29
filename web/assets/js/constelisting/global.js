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

	$('#inputAddress').on("search", function(event, address){
		window.console.log('address = ' +address);
		if (constellationMode) redirectToConstelisting('biopen_constellation', address);
		else panMapToAddress(address);
	});

	/*$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);*/

	setTimeout(ajuster_taille_composants,50);

	$('#btn-bandeau-helper-close').click(hideBandeauHelper);

	var res;
	window.onresize=function() 
	{
	    if (res) {clearTimeout(res) };
	    res = setTimeout(ajuster_taille_composants,200);
	};	

	//   MENU PROVIDER
	var menu_provider = $('#bandeau_detail .menu-provider');
	menu_provider.find('.icon-edit').click(function() {
		Routing.generate('biopen_fournisseur_edit', { id : getCurrentProviderIdShown() }); 
	});
	menu_provider.find('.icon-delete').click(function() {
		Routing.generate('biopen_fournisseur_delete', { id : getCurrentProviderIdShown() }); 
	});
	menu_provider.find('.icon-directions').click(function() {
		alert('itinéraire pour provider : ' + getCurrentProviderIdShown() ); 
	});
});

function getCurrentProviderIdShown()
{
	return $('#bandeau_detail').find('.providerItem').attr('data-provider-id');
}

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

	if (constellationMode)
	{
		if ($('#ProviderList').offset().top < 100)
		{
			$('#ProviderList ul').css('height',$('#ProviderList').height() - $('#ProviderList .starRepresentationChoice-helper:visible').outerHeight(true) );
		}
		else
		{
			$('#ProviderList ul').css('height','auto');
		}
	}

	ajuster_tailler_info_provider();	
	ajuster_taille_carte();
}

var matchMediaBigSize_old;
function ajuster_taille_carte(bandeau_detail_height = $('#bandeau_detail').outerHeight(true))
{		
	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	if (matchMediaBigSize_old) bandeau_detail_height = 0;
		  	$("#map").css('height',$("#section_carte").height()-bandeau_detail_height);	
		  	matchMediaBigSize_old = false;
	  	} 
		else 
		{			
		  	$("#map").css('height',$("#section_carte").height());	
		  	if ($('#bandeau_detail').is(":visible")) $('#map').css('margin-right','440px');	 
		  	matchMediaBigSize_old = true; 	
		}
	}	
}

function ajuster_tailler_info_provider()
{
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

	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	$('#bandeau_detail .moreDetails').css('height', 'auto');
		  	$('#bandeau_detail .collapsible-body').css('margin-top','0px');
	  	} 
		else 
		{			
		  	var bandeau_detail = $("#bandeau_detail");
		  	var height = bandeau_detail.outerHeight(true)
		  				-bandeau_detail.find('.collapsible-header').outerHeight(true)
		  				-bandeau_detail.find(".menu-provider").outerHeight(true);

		  	$('#bandeau_detail .collapsible-body').css('height', height);
		  	$('#bandeau_detail .collapsible-body').css('margin-top', bandeau_detail.find('.collapsible-header').outerHeight(true));
		}
	}
}





