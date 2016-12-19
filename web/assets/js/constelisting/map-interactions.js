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
			$('#bandeau_detail .menu-element .icon-star-empty').show();
			$('#bandeau_detail .menu-element .icon-star-full').hide();
		}	
		else 
		{
			$('#bandeau_detail .menu-element .icon-star-empty').hide();
			$('#bandeau_detail .menu-element .icon-star-full').show();
		}
	}	

	$('#detail_element').html(element.getHtmlRepresentation());	
	$('#bandeau_detail .menu-element').removeClass().addClass("menu-element " +element.type);

	$('#btn-close-bandeau-detail').click(function()
	{  
		if (App.getState() != "starRepresentationChoice") App.setState("normal");
		animate_down_bandeau_detail();
		return false;
	});
	$('#detail_element .collapsible-header').click(toggleElementDetailsComplet);
	animate_up_bandeau_detail();
}

function toggleElementDetailsComplet()
{	
	App.setTimeoutBandeauDetail();

	if ( $('#bandeau_detail .moreDetails').is(':visible') )
	{
		hideElementDetailsComplet();
		$('#bandeau_helper').css('z-index',20).animate({'opacity': '1'},500);
		$('#btn_menu').fadeIn();		
	}
	else
	{
		$('#bandeau_helper').animate({'opacity': '0'},500).css('z-index',-1);
		$('#btn_menu').fadeOut();

		$('#bandeau_detail .moreInfos').hide();
		$('#bandeau_detail .lessInfos').show();	
		
		$('#bandeau_detail .moreDetails').show();		

		var bandeau_detail_new_height =  $( window ).height();
		bandeau_detail_new_height -= $('header').height();
		bandeau_detail_new_height -=$('#bandeau_goToElementList').outerHeight(true);

		$('#bandeau_detail').css('height', '100%');

		var bandeau_detail = $("#bandeau_detail");
	  	var height =  bandeau_detail_new_height;
		height -= bandeau_detail.find('.collapsible-header').outerHeight(true);
		height -= bandeau_detail.find('.starRepresentationChoice-helper:visible').outerHeight(true);
		height -= bandeau_detail.find(".menu-element").outerHeight(true);

	  	$('#bandeau_detail .collapsible-body').css('height', height);
		
		ajuster_taille_carte(bandeau_detail_new_height);			
	}	
}

function hideElementDetailsComplet()
{
	App.setTimeoutBandeauDetail();

	//setTimeout(function(){$("#btn_menu").show();},1000);
	if ($('#bandeau_detail .moreDetails').is(':visible'))
	{
		$('#bandeau_detail .moreDetails').hide();
		$('#bandeau_detail .moreInfos').show();
		$('#bandeau_detail .lessInfos').hide();

		var bandeau_detail_new_height = $('#detail_element').outerHeight(true) + $('#bandeau_detail .starRepresentationChoice-helper:visible').height();

		$('#bandeau_detail').css('height', bandeau_detail_new_height);

		ajuster_taille_carte(bandeau_detail_new_height);	
	}	
}

function animate_up_bandeau_detail()
{
	App.setTimeoutBandeauDetail();

	if ($('#bandeau_detail').css('position') != 'absolute')
	{
		$('#bandeau_detail').show();

		var bandeau_detail_new_height = $('#detail_element').outerHeight(true);
		bandeau_detail_new_height += $('#bandeau_detail .starRepresentationChoice-helper:visible').height();

		$('#bandeau_detail').css('height', bandeau_detail_new_height);
		ajuster_tailler_info_element();
		ajuster_taille_carte(bandeau_detail_new_height);
	}	
	else
	{
		/*$('#bandeau_detail').show();
		ajuster_tailler_info_element();*/		

		if (!$('#bandeau_detail').is(':visible'))
		{
			$('#bandeau_detail').css('right','-500px');			
			$('#bandeau_detail').show().animate({'right':'0'},350,'swing',function(){ ajuster_taille_carte(0); });
		}
		
		ajuster_tailler_info_element();
		//$('#bandeau_detail').show("slide", {direction: 'rigth', easing: 'swing'} , 350 );
	}
}

function animate_down_bandeau_detail()
{
	if ($('#bandeau_detail').is(':visible'))
	{
		if ($('#bandeau_detail').css('position') != 'absolute')
		{
			hideElementDetailsComplet();
			$('#bandeau_detail').css('height','0');
			$('#bandeau_detail').hide();
			ajuster_taille_carte(0);
		}
		else
		{
			$('#map').css('margin-right','0px');
			$('#bandeau_helper').css('margin-right','0px');

			if ($('#bandeau_detail').is(':visible'))
			{		
				$('#bandeau_detail').animate({'right':'-500px'},350,'swing',function(){ $(this).hide();ajuster_taille_carte(0);  });
				
			}		
		}
	}	

}