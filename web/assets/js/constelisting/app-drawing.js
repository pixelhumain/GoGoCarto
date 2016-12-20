/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
jQuery(document).ready(function()
{	
	//animation pour lien d'ancre dans la page
   /* $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 700);
	    return false;  
	}); */

	$('#search-bar').on("search", function(event, address)
	{
		if (constellationMode) redirectTodirectory('biopen_constellation', address, $('#search_distance').val());
		else panMapToAddress(address);

		// If Menu take all available width (in case of small mobile)
		if ($('#directory-menu').outerWidth() == $(window).outerWidth())
		{
			// then we hide menu to show search result
			hidedirectory-menu();
		}
	});		

	/*$('#menu-button').click(animate_up_bandeau_options);
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
	$("#directory-menu-main-container").scroll(function() 
	{
	  if ($(this).scrollTop() > 0) {
	    $('#menu-title .shadow-bottom').show();
	  } else {
	    $('#menu-title .shadow-bottom').hide();
	  }
	});
	
	//Menu CARTE
	$('#menu-button').click(showdirectory-menu);
	$('#overlay').click(hidedirectory-menu);
	$('#menu-title > .icon-close').click(hidedirectory-menu);

	if (onlyInputAdressMode)
	{
		showOnlyInputAdress();
	}

	$('#list_tab').click(function(){
		$("#ElementList").show();
		$('#directory-container').hide();
	});
	$('#directory-content-map_tab').click(function(){		
		$('#directory-container').show();
		$("#ElementList").hide();
	});
});

function showdirectory-menu()
{
	animate_down_directory-content-info-bar();  
	$('#overlay').css('z-index','10');
	$('#overlay').animate({'opacity': '.6'},700);
	$('#directory-menu').show( "slide", {direction: 'left', easing: 'swing'} , 350 );
	//$('#directory-menu').css('width','0px').show().animate({'width': '240px'},700);
}

function hidedirectory-menu()
{
	$('#overlay').css('z-index','-1');
	$('#overlay').animate({'opacity': '.0'},500);
	$('#directory-menu').hide( "slide", {direction: 'left', easing: 'swing'} , 250 );
	$('#menu-title .shadow-bottom').hide();
	//$('#directory-menu').animate({'width': '0px'},700).hide();
}

function hideBandeauHelper()
{
	$('#bandeau_helper').slideUp(slideOptions);
}

function showOnlyInputAdress()
{
	hideBandeauHelper();
	$('#directory-content').css('margin-left','0');
	$('#bandeau_tabs').hide();
	$('#ElementList').hide();
	ajuster_taille_composants();
}

function ajuster_taille_composants()
{	
	//$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	$('#page-content').css('height','auto');

	var content_height = $(window).height() - $('header').height();
	content_height -= $('#bandeau_tabs:visible').outerHeight(true);
	$("#directory-container").css('height',content_height);
	$("#ElementList").css('height',content_height);

	if (App) setTimeout(App.updateMaxElements, 500);

	ajuster_taille_elementList();
	ajuster_tailler_info_element();	
	ajuster_taille_carte();
}

function ajuster_taille_elementList()
{
	/*if (constellationMode)
	{
		if ($('#ElementList').offset().top < 100)
		{
			$('#ElementList ul').css('height',$('#ElementList').height() 
				- $('#ElementList .starRepresentationChoice-helper:visible').outerHeight(true)
				- $('#ElementList .element-list-title:visible').outerHeight(true) );
		}
		else
		{
			$('#ElementList ul').css('height','auto');
		}
	}*/
}

var matchMediaBigSize_old;
function ajuster_taille_carte(directory-content-info-bar_height)
{		
	directory-content-info-bar_height = directory-content-info-bar_height || $('#directory-content-info-bar').outerHeight(true);

	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 600px)").matches) 
	  	{
	  		$("#directory-menu").css('height',$("#directory-content").height()-directory-content-info-bar_height);	
	  	}
	  	else
	  	{
	  		$("#directory-menu").css('height','100%');
	  	}

		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	if (matchMediaBigSize_old) directory-content-info-bar_height = 0;

		  	$("#directory-content-map").css('height',$("#directory-content").height()-directory-content-info-bar_height);	
		  	

		  	matchMediaBigSize_old = false;
	  	} 
		else 
		{			
		  	$("#directory-content-map").css('height',$("#directory-content").height());	
		  	if ($('#directory-content-info-bar').is(":visible")) 
	  		{
	  			$('#directory-content-map').css('margin-right','480px');
	  			$('#bandeau_helper').css('margin-right','480px');
	  			
	  		}
		  	else 
	  		{
	  			$('#directory-content-map').css('margin-right','0px');
	  			$('#bandeau_helper').css('margin-right','0px');
	  		}
		  	matchMediaBigSize_old = true; 	
		}
	}

	// après 500ms l'animation de redimensionnement est terminé
	// on trigger cet évenement pour que la carte se redimensionne vraiment
	if (App) setTimeout(function() { google.maps.event.trigger(App.getMap(), 'resize'); },500);
}

function ajuster_tailler_info_element()
{
	if ($('#directory-content-info-bar').width() < '600')
	{
		$('#directory-content-info-bar').removeClass("largeWidth");
		$('#directory-content-info-bar').addClass("smallWidth");
	}
	else
	{
		$('#directory-content-info-bar').addClass("largeWidth");
		$('#directory-content-info-bar').removeClass("smallWidth");
	}

	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	$('#directory-content-info-bar .moreDetails').css('height', 'auto');
		  	$('#directory-content-info-bar .collapsible-body').css('margin-top','0px');
	  	} 
		else 
		{			
		  	var directory-content-info-bar = $("#directory-content-info-bar");
		  	var height = directory-content-info-bar.outerHeight(true);
			height -= directory-content-info-bar.find('.collapsible-header').outerHeight(true);
			height -= directory-content-info-bar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
			height -= directory-content-info-bar.find(".menu-element").outerHeight(true);

		  	$('#directory-content-info-bar .collapsible-body').css('height', height);
		  	$('#directory-content-info-bar .collapsible-body').css('margin-top', directory-content-info-bar.find('.collapsible-header').outerHeight(true)+directory-content-info-bar.find('.starRepresentationChoice-helper:visible').outerHeight(true));
		}
	}
}





