jQuery(document).ready(function()
{
});

function showProviderInfosOnMap(providerId, showMoreChoiceInfo = true) 
{	
	if (constellationMode)
	{
		// durty method to know if we are in large screen
		if ($('#ProviderList').offset().top < 100)
		{			
			$('.providerItem .moreDetails').hide();
			$('.providerItem .active').removeClass('active');

			var target = $('#infoProvider-'+providerId);
		    $('#ProviderList ul').animate({scrollTop: '+='+$(target).position().top}, 500);
		    target.find(' .moreDetails').slideDown(slideOptions)
		    target.addClass('active');
		    target.find('.collapsible-header').addClass('active');

		    return;
		}
		else
		{
			$('#detail_provider').empty();
			$('#infoProvider-'+providerId).clone().appendTo( "#detail_provider").show();
			$('#detail_provider .moreDetails').hide();
			$('#detail_provider .btn-select-as-representant').hide();
		}			
	}
	else
	{
		var provider = GLOBAL.getProviderManager().getProviderById(providerId);
		$('#detail_provider').html(provider.getHtmlRepresentation());
	}	
	
	$('#detail_provider .collapsible-header').click(toggleProviderDetailsComplet);
	animate_up_bandeau_detail();
};

function toggleProviderDetailsComplet()
{	
	if ( $('#bandeau_detail .moreDetails').is(':visible') )
	{
		hideProviderDetailsComplet();
		$('#bandeau_helper').css('z-index',20).animate({'opacity': '1'},500);
		$('#btn_menu').fadeIn();		
	}
	else
	{
		$('#bandeau_helper').animate({'opacity': '0'},500).css('z-index',-1);
		$('#btn_menu').fadeOut();	
		$('#bandeau_detail .moreDetails').show();

		$('#bandeau_detail .moreInfos').hide();
		$('#bandeau_detail .lessInfos').show();

		var bandeau_detail_new_height = $( window ).height()
		-$('header').height()
		-$('#bandeau_goToProviderList').outerHeight(true);

		$('#bandeau_detail').css('height', '100%');
		ajuster_taille_carte(bandeau_detail_new_height);	

		//$("#btn_menu").hide();		
		
	}	
}

function hideProviderDetailsComplet()
{
	//setTimeout(function(){$("#btn_menu").show();},1000);
	if ($('#bandeau_detail .moreDetails').is(':visible'))
	{
		$('#bandeau_detail .moreDetails').hide();
		$('#bandeau_detail .moreInfos').show();
		$('#bandeau_detail .lessInfos').hide();

		var bandeau_detail_new_height = $('#detail_provider').outerHeight(true) + $('#bandeau_detail .starRepresentationChoice-helper:visible').height();

		$('#bandeau_detail').css('height', bandeau_detail_new_height);

		ajuster_taille_carte(bandeau_detail_new_height);	
	}	
}

function animate_up_bandeau_detail()
{
	if ($('#bandeau_detail').css('position') != 'absolute')
	{
		$('#bandeau_detail').show();

		var bandeau_detail_new_height = $('#detail_provider').outerHeight(true)
		+ $('#bandeau_detail .starRepresentationChoice-helper:visible').height();

		$('#bandeau_detail').css('height', bandeau_detail_new_height);
		ajuster_tailler_info_provider();
		ajuster_taille_carte(bandeau_detail_new_height);
	}	
	else
	{
		$('#bandeau_detail').show();
		ajuster_tailler_info_provider();

		//$('#bandeau_detail').show( "slide", {direction: 'rigth', easing: 'swing'} , 350 );
		//ajuster_tailler_info_provider();
		ajuster_taille_carte(0);
		
	}
}

function animate_down_bandeau_detail()
{
	if ($('#bandeau_detail').is(':visible'))
	{
		if ($('#bandeau_detail').css('position') != 'absolute')
		{
			hideProviderDetailsComplet();
			$('#bandeau_detail').css('height','0');
			$('#bandeau_detail').hide();
			ajuster_taille_carte(0);
		}
		else
		{
			$('#map').css('margin-right','0px');
			$('#bandeau_detail').hide();			
		}
	}	

}