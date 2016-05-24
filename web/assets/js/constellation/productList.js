
var slideOptions = { duration: 450, easing: "easeOutQuart", queue: false, complete: function() {}};
	
jQuery(document).ready(function()
{	
	$('.productItem:not(.disabled)').mouseenter(function() {
		if ($('.moreResultContainer:visible').size() > 0) return;
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showBigSize();
	}).mouseleave(function() {
		if ($('.moreResultContainer:visible').size() > 0) return;
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showNormalSize();
	});

	$('.resultNumber:not(.disabled)').click(function()
	{
		if ($(this).parent().attr('data-providers-size') == 1)
		{			
			var star = GLOBAL.getConstellation().getStarFromName($(this).parent().attr('data-star-name'));
			showProviderInfosOnMap(star.getProviderId(), false);
		}
		else
		{			
			animate_down_bandeau_detail(); 
		}

		var star = GLOBAL.getConstellation().getStarFromName($(this).parent().attr('data-star-name'));
		var idToFocus = star.getProviderListId();
		
		var body = $(this).parent().parent().find('.moreResultContainer');
		
		// if the moreResultContainer si already visible
		if (body.is(":visible")) 
		{
			body.stop(true,false).slideUp(slideOptions);
			GLOBAL.getMarkerManager().clearFocusOnThesesMarkers(idToFocus);
			GLOBAL.getProviderManager().clearFocusOnThesesProviders(idToFocus);
			GLOBAL.getClusterer().repaint();	
			animate_down_bandeau_detail(); 
			GLOBAL.setState('normal');
		}
		else
		{
			clearProductList();

			body.stop(true,false).slideDown(slideOptions);
			GLOBAL.getMarkerManager().focusOnThesesMarkers(idToFocus,star.getName());
			GLOBAL.getProviderManager().focusOnThesesProviders(idToFocus,star.getName());
			GLOBAL.getClusterer().repaint();
			GLOBAL.setState('starRepresentationChoice');

			hideBandeauHelper();
		}		
	});

	$('.moreResultProviderItem, .providerItem').mouseenter(function() {
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showBigSize();
	}).mouseleave(function() {
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showNormalSize();
	});
	
	$('.moreResultProviderItem').click(handleClickChooseProviderForStar);

	$('.productTitle').click(clearProductList);
});

function clearProductList()
{
	if (GLOBAL.getState() == 'starRepresentationChoice')
	{
		var otherContainerVisible = $('.moreResultContainer:visible').first();
		var otherStarName = otherContainerVisible.parent().find('.productItem').attr('data-star-name');
		var otherStar = GLOBAL.getConstellation().getStarFromName(otherStarName);
		var otherIdsToClear = otherStar.getProviderListId();
		otherContainerVisible.stop(true,false).slideUp(slideOptions);
		GLOBAL.getMarkerManager().clearFocusOnThesesMarkers(otherIdsToClear);
		GLOBAL.getProviderManager().clearFocusOnThesesProviders(otherIdsToClear);
		GLOBAL.setState('normal');
		GLOBAL.getClusterer().repaint();
	}	
}

function handleClickChooseProviderForStar() 
{
	var starName = $(this).attr('data-star-name');
	var providerIndex = $(this).attr('data-provider-index');
	var star = GLOBAL.getConstellation().getStarFromName(starName);
	star.setIndex(providerIndex);
	
	$('.moreResultContainer:visible .starProvider').removeClass('starProvider');
	$('#moreResult-'+starName+'-'+providerIndex).addClass("starProvider");
	/*$(this).parents('li').find('.productItem').click();
	$(this).siblings('li').removeClass('starProvider');
	$(this).addClass("starProvider");*/

	ev.preventDefault();
	ev.stopPropagation();
	event.preventDefault();
}
