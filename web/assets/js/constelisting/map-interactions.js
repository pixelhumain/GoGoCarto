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
	
});

function showElementInfosOnMap(elementId) 
{
	var element = App.getElementManager().getElementById(elementId);

	var statesToAvoid = ["showRouting","showElementAlone","starRepresentationChoice"];
	if ($.inArray(App.getState(), statesToAvoid) == -1 ) App.setState("showElement", {id: elementId});		

	if (!constellationMode)
	{
		if (!element.isFavorite) 
		{
			$('#directory-content-info-bar .menu-element .icon-star-empty').show();
			$('#directory-content-info-bar .menu-element .icon-star-full').hide();
		}	
		else 
		{
			$('#directory-content-info-bar .menu-element .icon-star-empty').hide();
			$('#directory-content-info-bar .menu-element .icon-star-full').show();
		}
	}	

	$('#element-info').html(element.getHtmlRepresentation());	
	$('#directory-content-info-bar .menu-element').removeClass().addClass("menu-element " +element.type);

	$('#btn-close-bandeau-detail').click(function()
	{  
		if (App.getState() != "starRepresentationChoice") App.setState("normal");
		animate_down_directory-content-info-bar();
		return false;
	});
	$('#element-info .collapsible-header').click(toggleElementDetailsComplet);
	animate_up_directory-content-info-bar();
}

function toggleElementDetailsComplet()
{	
	App.setTimeoutBandeauDetail();

	if ( $('#directory-content-info-bar .moreDetails').is(':visible') )
	{
		hideElementDetailsComplet();
		$('#bandeau_helper').css('z-index',20).animate({'opacity': '1'},500);
		$('#menu-button').fadeIn();		
	}
	else
	{
		$('#bandeau_helper').animate({'opacity': '0'},500).css('z-index',-1);
		$('#menu-button').fadeOut();

		$('#directory-content-info-bar .moreInfos').hide();
		$('#directory-content-info-bar .lessInfos').show();	
		
		$('#directory-content-info-bar .moreDetails').show();		

		var directory-content-info-bar_new_height =  $( window ).height();
		directory-content-info-bar_new_height -= $('header').height();
		directory-content-info-bar_new_height -=$('#bandeau_goToElementList').outerHeight(true);

		$('#directory-content-info-bar').css('height', '100%');

		var directory-content-info-bar = $("#directory-content-info-bar");
	  	var height =  directory-content-info-bar_new_height;
		height -= directory-content-info-bar.find('.collapsible-header').outerHeight(true);
		height -= directory-content-info-bar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
		height -= directory-content-info-bar.find(".menu-element").outerHeight(true);

	  	$('#directory-content-info-bar .collapsible-body').css('height', height);
		
		ajuster_taille_carte(directory-content-info-bar_new_height);			
	}	
}

function hideElementDetailsComplet()
{
	App.setTimeoutBandeauDetail();

	//setTimeout(function(){$("#menu-button").show();},1000);
	if ($('#directory-content-info-bar .moreDetails').is(':visible'))
	{
		$('#directory-content-info-bar .moreDetails').hide();
		$('#directory-content-info-bar .moreInfos').show();
		$('#directory-content-info-bar .lessInfos').hide();

		var directory-content-info-bar_new_height = $('#element-info').outerHeight(true) + $('#directory-content-info-bar .starRepresentationChoice-helper:visible').height();

		$('#directory-content-info-bar').css('height', directory-content-info-bar_new_height);

		ajuster_taille_carte(directory-content-info-bar_new_height);	
	}	
}

function animate_up_directory-content-info-bar()
{
	App.setTimeoutBandeauDetail();

	if ($('#directory-content-info-bar').css('position') != 'absolute')
	{
		$('#directory-content-info-bar').show();

		var directory-content-info-bar_new_height = $('#element-info').outerHeight(true);
		directory-content-info-bar_new_height += $('#directory-content-info-bar .starRepresentationChoice-helper:visible').height();

		$('#directory-content-info-bar').css('height', directory-content-info-bar_new_height);
		ajuster_tailler_info_element();
		ajuster_taille_carte(directory-content-info-bar_new_height);
	}	
	else
	{
		/*$('#directory-content-info-bar').show();
		ajuster_tailler_info_element();*/		

		if (!$('#directory-content-info-bar').is(':visible'))
		{
			$('#directory-content-info-bar').css('right','-500px');			
			$('#directory-content-info-bar').show().animate({'right':'0'},350,'swing',function(){ ajuster_taille_carte(0); });
		}
		
		ajuster_tailler_info_element();
		//$('#directory-content-info-bar').show("slide", {direction: 'rigth', easing: 'swing'} , 350 );
	}
}

function animate_down_directory-content-info-bar()
{
	if ($('#directory-content-info-bar').is(':visible'))
	{
		if ($('#directory-content-info-bar').css('position') != 'absolute')
		{
			hideElementDetailsComplet();
			$('#directory-content-info-bar').css('height','0');
			$('#directory-content-info-bar').hide();
			ajuster_taille_carte(0);
		}
		else
		{
			$('#directory-content-map').css('margin-right','0px');
			$('#bandeau_helper').css('margin-right','0px');

			if ($('#directory-content-info-bar').is(':visible'))
			{		
				$('#directory-content-info-bar').animate({'right':'-500px'},350,'swing',function(){ $(this).hide();ajuster_taille_carte(0);  });
				
			}		
		}
	}	

}