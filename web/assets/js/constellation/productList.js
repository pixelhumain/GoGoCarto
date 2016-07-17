var slideOptions = { duration: 500, easing: "easeOutQuart", queue: false, complete: function() {}};

jQuery(document).ready(function()
{
if (constellationMode)	
{
	// MODE StarRepresentationChoice
	$('.productItem:not(.disabled)').click(function()
	{
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		
		var moreResultContainer = $(this).parent().find('.moreResultContainer');
		
		// if the moreResultContainer si already visible
		if (moreResultContainer.hasClass("active")) 
		{
			moreResultContainer.stop(true,false).slideUp(slideOptions);
			moreResultContainer.removeClass("active");
			GLOBAL.getSRCManager().end();
		}
		else
		{
			clearProductList();
			GLOBAL.getSRCManager().end();
			
			if ($('#ProductsList').outerWidth() == $(window).outerWidth())
			{
				if (! moreResultContainer.find('.see-more-result-on-map').length)
				{
					moreResultContainer.prepend('<div class="see-more-result-on-map">Voir sur la carte</div>');
					moreResultContainer.find('.see-more-result-on-map').click(hideProductsList);
				}
			}

			moreResultContainer.stop(true,false).slideDown(slideOptions);
			moreResultContainer.addClass("active");
			GLOBAL.getSRCManager().begin(star);	

			if ($(this).attr('data-providers-size') == 1)
			{			
				showProviderInfosOnMap(star.getProviderId(), false);
			}
			else
			{
				var that = this;
				setTimeout(function() 
				{
					$('#ProductsList').animate({scrollTop: '+='+$(that).position().top}, 500);
				}, 400);
				animate_down_bandeau_detail();
			}		
		}		
	});

	// Click sur un des choix des représentants de l'étoile
	$('.moreResultProviderItem').click(function() { GLOBAL.getSRCManager().selectProviderIndex( $(this).attr('data-provider-index') ); });

	// Gestion hover pour la liste de produit
	$('.productItem:not(.disabled)').mouseenter(function() 
	{
		if (GLOBAL.getState() == 'starRepresentationChoice') return;
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showBigSize();
	}).mouseleave(function() 
	{
		if (GLOBAL.getState() == 'starRepresentationChoice') return;
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showNormalSize();
	});

	// Gestion hover pour le choix du réprésentant de l'étoile
	$('.moreResultProviderItem, .providerItem').mouseenter(function() 
	{
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showBigSize();
	}).mouseleave(function() 
	{
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showNormalSize();
	});

	$('#search_distance').change(function() { $("#search_distance_value").text($(this).val()); });
}
});

function clearProductList()
{
	var otherContainerVisible = $('.moreResultContainer.active').first();
	otherContainerVisible.stop(true,false).slideUp(slideOptions);
	otherContainerVisible.removeClass("active");
}
