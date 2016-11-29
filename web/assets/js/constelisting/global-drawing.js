/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-12
 */
jQuery(document).ready(function()
{	
	//animation pour lien d'ancre dans la page
   /* $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 700);
	    return false;  
	}); */

	$('#inputAddress').on("search", function(event, address)
	{
		if (constellationMode) redirectToConstelisting('biopen_constellation', address, $('#search_distance').val());
		else panMapToAddress(address);

		// If Menu take all available width (in case of small mobile)
		if ($('#ProductsList').outerWidth() == $(window).outerWidth())
		{
			// then we hide menu to show search result
			hideProductsList();
		}
	});		

	/*$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);*/

	setTimeout(ajuster_taille_composants,50);

	$('#btn-bandeau-helper-close').click(hideBandeauHelper);

	var res;
	window.onresize = function() 
	{
	    if (res) {clearTimeout(res); }
	    res = setTimeout(ajuster_taille_composants,200);
	};	

	// scroller tout seul en haut de la page quand on en est pas loin
	var lastEndScrollTop = 0, st = 0;
	var timeout = null;	
	$(window).scroll(function(event)
	{
	   clearTimeout(timeout);
	   st = $(this).scrollTop();
	   timeout = setTimeout(function()
	   {
	       //end of scrolling
	       if (st < 250 && lastEndScrollTop > 250)
		   {		    	
		    	$('html, body').animate({scrollTop: 0}, 400);		    	
		   }
		   lastEndScrollTop = st;
	   },100);	 	   
	});

	// affiche une petite ombre sous le titre menu quand on scroll
	// (uniquement visible sur petts écrans)
	$("#productListMainContainer").scroll(function() 
	{
	  if ($(this).scrollTop() > 0) {
	    $('#menu-title .shadow-bottom').show();
	  } else {
	    $('#menu-title .shadow-bottom').hide();
	  }
	});
	
	//Menu CARTE
	$('#btn_menu').click(showProductsList);
	$('#overlay').click(hideProductsList);
	$('#menu-title > .icon-close').click(hideProductsList);

	if (onlyInputAdressMode)
	{
		showOnlyInputAdress();
	}

	$('#list_tab').click(function(){
		$("#ProviderList").show();
		$('#div_map_and_products').hide();
	});
	$('#map_tab').click(function(){		
		$('#div_map_and_products').show();
		$("#ProviderList").hide();
	});
});

function showProductsList()
{
	animate_down_bandeau_detail();  
	$('#overlay').css('z-index','10');
	$('#overlay').animate({'opacity': '.6'},700);
	$('#ProductsList').show( "slide", {direction: 'left', easing: 'swing'} , 350 );
	//$('#ProductsList').css('width','0px').show().animate({'width': '240px'},700);
}

function hideProductsList()
{
	$('#overlay').css('z-index','-1');
	$('#overlay').animate({'opacity': '.0'},500);
	$('#ProductsList').hide( "slide", {direction: 'left', easing: 'swing'} , 250 );
	$('#menu-title .shadow-bottom').hide();
	//$('#ProductsList').animate({'width': '0px'},700).hide();
}

function hideBandeauHelper()
{
	$('#bandeau_helper').slideUp(slideOptions);
}

function showOnlyInputAdress()
{
	hideBandeauHelper();
	$('#section_carte').css('margin-left','0');
	$('#bandeau_tabs').hide();
	$('#ProviderList').hide();
	ajuster_taille_composants();
}

function ajuster_taille_composants()
{	
	//$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	$('#page_content').css('height','auto');

	var content_height = $(window).height() - $('header').height();
	content_height -= $('#bandeau_tabs:visible').outerHeight(true);
	$("#div_map_and_products").css('height',content_height);
	$("#ProviderList").css('height',content_height);

	if (GLOBAL) setTimeout(GLOBAL.updateMaxProviders, 500);

	ajuster_taille_providerList();
	ajuster_tailler_info_provider();	
	ajuster_taille_carte();
}

function ajuster_taille_providerList()
{
	/*if (constellationMode)
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
	}*/
}

var matchMediaBigSize_old;
function ajuster_taille_carte(bandeau_detail_height)
{		
	bandeau_detail_height = bandeau_detail_height || $('#bandeau_detail').outerHeight(true);

	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 600px)").matches) 
	  	{
	  		$("#ProductsList").css('height',$("#section_carte").height()-bandeau_detail_height);	
	  	}
	  	else
	  	{
	  		$("#ProductsList").css('height','100%');
	  	}

		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	if (matchMediaBigSize_old) bandeau_detail_height = 0;

		  	$("#map").css('height',$("#section_carte").height()-bandeau_detail_height);	
		  	

		  	matchMediaBigSize_old = false;
	  	} 
		else 
		{			
		  	$("#map").css('height',$("#section_carte").height());	
		  	if ($('#bandeau_detail').is(":visible")) 
	  		{
	  			$('#map').css('margin-right','480px');
	  			$('#bandeau_helper').css('margin-right','480px');
	  			
	  		}
		  	else 
	  		{
	  			$('#map').css('margin-right','0px');
	  			$('#bandeau_helper').css('margin-right','0px');
	  		}
		  	matchMediaBigSize_old = true; 	
		}
	}

	// après 500ms l'animation de redimensionnement est terminé
	// on trigger cet évenement pour que la carte se redimensionne vraiment
	if (GLOBAL) setTimeout(function() { google.maps.event.trigger(GLOBAL.getMap(), 'resize'); },500);
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
		  	var height = bandeau_detail.outerHeight(true);
			height -= bandeau_detail.find('.collapsible-header').outerHeight(true);
			height -= bandeau_detail.find('.starRepresentationChoice-helper:visible').outerHeight(true);
			height -= bandeau_detail.find(".menu-provider").outerHeight(true);

		  	$('#bandeau_detail .collapsible-body').css('height', height);
		  	$('#bandeau_detail .collapsible-body').css('margin-top', bandeau_detail.find('.collapsible-header').outerHeight(true)+bandeau_detail.find('.starRepresentationChoice-helper:visible').outerHeight(true));
		}
	}
}





