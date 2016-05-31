jQuery(document).ready(function()
{	
	//animation pour lien d'ancre dans la page
    $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 700);
	    return false;  
	}); 

	$('#inputAddress').on("search", function(event, address){
		window.console.log('address = ' +address + ' distane = ' + $('#search_distance').val());
		if (constellationMode) redirectToConstelisting('biopen_constellation', address, $('#search_distance').val());
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

	//Menu CARTE
	$('#btn_menu').click(showProductsList);
	$('#overlay').click(hideProductsList);
	$('#menu-title > .icon-close').click(hideProductsList);
});

function showProductsList()
{
	animate_down_bandeau_detail();  
	$('#overlay').css('z-index','10');
	$('#overlay').animate({'opacity': '.6'},700);
	$('#ProductsList').toggle( "slide", {direction: 'left', easing: 'swing'} , 350 );
	//$('#ProductsList').css('width','0px').show().animate({'width': '240px'},700);
}

function hideProductsList()
{
	$('#overlay').css('z-index','-1');
	$('#overlay').animate({'opacity': '.0'},500);
	$('#ProductsList').toggle( "slide", {direction: 'left', easing: 'swing'} , 250 );
	//$('#ProductsList').animate({'width': '0px'},700).hide();
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


	ajuster_taille_providerList();
	ajuster_tailler_info_provider();	
	ajuster_taille_carte();
}

function ajuster_taille_providerList()
{
	if (constellationMode)
	{
		if ($('#ProviderList').offset().top < 100)
		{
			$('#ProviderList ul').css('height',$('#ProviderList').height() 
				- $('#ProviderList .starRepresentationChoice-helper:visible').outerHeight(true)
				- $('#ProviderList .provider-list-title:visible').outerHeight(true) );
		}
		else
		{
			$('#ProviderList ul').css('height','auto');
		}
	}
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
		  	else $('#map').css('margin-right','0px');
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





