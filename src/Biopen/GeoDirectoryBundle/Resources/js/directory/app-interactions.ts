/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { AppModule, AppStates, AppModes } from "./app.module";
declare let App : AppModule;
import { redirectToDirectory } from "../commons/commons";

//declare var $;
declare let $ : any;

export function initializeAppInteractions()
{	
	//animation pour lien d'ancre dans la page
   /* $('a[href^="#"]').click(function(){  
	    let target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 700);
	    return false;  
	}); */		

	/*$('#menu-button').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);*/

	updateComponentsSize();

	$('#btn-bandeau-helper-close').click(hideBandeauHelper);

	$('.flash-message .btn-close').click( function() { $(this).parent().slideUp('fast', function() { updateComponentsSize(); }); });

	$('#btn-close-directions').click( () => 
	{
		App.setState(AppStates.ShowElement, { id : App.infoBarComponent.getCurrElementId() });
	});

	let res;
	window.onresize = function() 
	{
	   if (res) {clearTimeout(res); }
	   res = setTimeout(updateComponentsSize,200);
	};	

	// Automatically scrool on top of page when we are close to top
	// let lastEndScrollTop = 0, st = 0;
	// let timeout = null;	
	// $(window).scroll(function(event)
	// {
	//    clearTimeout(timeout);
	//    st = $(this).scrollTop();
	//    timeout = setTimeout(function()
	//    {
	//        //end of scrolling
	//        if (st < 250 && lastEndScrollTop > 250)
	// 	   {		    	
	// 	    	$('html, body').animate({scrollTop: 0}, 400);		    	
	// 	   }
	// 	   lastEndScrollTop = st;
	//    },100);	 	   
	// });	
	
	//Menu CARTE	
	$('#menu-button').click(showDirectoryMenu);
	$('#overlay').click(hideDirectoryMenu);
	$('#menu-title > .icon-close').click(hideDirectoryMenu);

	$('#directory-content-map .show-as-list-button').click((e : Event) => {		
		App.setTimeoutClicking();
		App.setMode(AppModes.List);

		e.preventDefault();
		e.stopPropagation();
	});

	$('#directory-content-list .show-as-map-button').click(() => {		
		App.setMode(AppModes.Map);
	});
	
	// if (onlyInputAdressMode)
	// {
	// 	showOnlyInputAdress();
	// }

	// $('#list_tab').click(function(){
	// 	$("#directory-content-list").show();
	// 	$('#directory-container').hide();
	// });
	// $('#directory-content-map_tab').click(function(){		
	// 	$('#directory-container').show();
	// 	$("#directory-content-list").hide();
	// });
}

export function showDirectoryMenu()
{
	App.infoBarComponent.hide();  
	$('#overlay').css('z-index','10');
	$('#overlay').animate({'opacity': '.6'},700);
	$('#directory-menu').show( "slide", {direction: 'left', easing: 'swing'} , 350 );
	//$('#directory-menu').css('width','0px').show().animate({'width': '240px'},700);
}

export function hideDirectoryMenu()
{
	$('#overlay').css('z-index','-1');
	$('#overlay').animate({'opacity': '.0'},500);
	$('#directory-menu').hide( "slide", {direction: 'left', easing: 'swing'} , 250 );
	$('#menu-title .shadow-bottom').hide();
	//$('#directory-menu').animate({'width': '0px'},700).hide();
}

let slideOptions = { duration: 500, easing: "easeOutQuart", queue: false, complete: function() {}};

export function hideBandeauHelper()
{
	$('#bandeau_helper').slideUp(slideOptions);
}

export function showOnlyInputAdress()
{
	hideBandeauHelper();
	$('#directory-content').css('margin-left','0');
	$('#bandeau_tabs').hide();
	$('#directory-content-list').hide();
	updateComponentsSize();
}

export function updateComponentsSize()
{	
	//$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	//console.log("Update component size");
	$('#page-content').css('height','auto');

	let content_height = $(window).height() - $('header').height();
	content_height -= $('.flash-messages-container').outerHeight(true);
	$("#directory-container").css('height',content_height);
	$("#directory-content-list").css('height',content_height);

	if (App) setTimeout(App.updateMaxElements, 500);

	updateInfoBarSize();	
	updateMapSize();
}


let matchMediaBigSize_old;
export function updateMapSize(elementInfoBar_height = $('#element-info-bar').outerHeight(true))
{		
	//console.log("updateMapSize", elementInfoBar_height);
	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 600px)").matches) 
	  	{
	  		$("#directory-menu").css('height',$("#directory-content").height()-elementInfoBar_height);	
	  	}
	  	else
	  	{
	  		$("#directory-menu").css('height','100%');
	  	}

		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	if (matchMediaBigSize_old) elementInfoBar_height = 0;

		  	//console.log("resize map height to", $("#directory-content").outerHeight()-elementInfoBar_height);
		  	$("#directory-content-map").css('height',$("#directory-content").outerHeight()-elementInfoBar_height);	
		  	

		  	matchMediaBigSize_old = false;
	  	} 
		else 
		{			
		  	$("#directory-content-map").css('height',$("#directory-content").height());	
		  	if ($('#element-info-bar').is(":visible")) 
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
	else
	{
		console.error("Match Media not available");
	}

	// après 500ms l'animation de redimensionnement est terminé
	// on trigger cet évenement pour que la carte se redimensionne vraiment
	if (App.mapComponent) setTimeout(function() { App.mapComponent.resize(); },500);
}

export function updateInfoBarSize()
{
	if ($('#element-info-bar').width() < 600)
	{
		$('#element-info-bar').removeClass("largeWidth");
		$('#element-info-bar').addClass("smallWidth");
	}
	else
	{
		$('#element-info-bar').addClass("largeWidth");
		$('#element-info-bar').removeClass("smallWidth");
	}

	if("matchMedia" in window) 
	{	
		if (window.matchMedia("(max-width: 1200px)").matches) 
		{
		  	$('#element-info-bar .moreDetails').css('height', 'auto');
		  	$('#element-info-bar .collapsible-body').css('margin-top','0px');
	  	} 
		else 
		{			
		  	let elementInfoBar = $("#element-info-bar");
		  	let height = elementInfoBar.outerHeight(true);
			height -= elementInfoBar.find('.collapsible-header').outerHeight(true);
			height -= elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
			height -= elementInfoBar.find(".menu-element").outerHeight(true);

		  	$('#element-info-bar .collapsible-body').css('height', height);
		  	$('#element-info-bar .collapsible-body').css('margin-top', elementInfoBar.find('.collapsible-header').outerHeight(true)+elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true));
		}
	}
}





