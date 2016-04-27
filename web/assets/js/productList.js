jQuery(document).ready(function()
{	
	$('.productItem:not(.disabled)').mouseenter(function() {
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showBigSize();
	}).mouseleave(function() {
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showNormalSize();
	});

	$('.moreResultProviderItem, .providerItem').mouseenter(function() {
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showBigSize();
	}).mouseleave(function() {
		var marker = GLOBAL.getMarkerManager().getMarkerById($(this).attr('data-provider-id'));
		marker.showNormalSize();
	});

	var observer = new MutationObserver(function(mutations) {
	    mutations.forEach(function(mutation) {
	        if (mutation.attributeName === "class") 
	        {
	           	var star = GLOBAL.getConstellation().getStarFromName($(mutation.target).attr('data-star-name'));
				var idToFocus = star.getProviderListId();
				if ($(mutation.target).hasClass('active'))
				{				
					GLOBAL.getMarkerManager().focusOnThesesMarkers(idToFocus);
					GLOBAL.getClusterer().repaint();
				}
				else
				{
					GLOBAL.getMarkerManager().clearFocusOnThesesMarkers(idToFocus);
					GLOBAL.getClusterer().repaint();
				}	
	        }
	    });
	});

	$('.productItem:not(.disabled)').each(function(){
		observer.observe($(this)[0],  {
	    	attributes: true
		});
	});
	
	$('.moreResultProviderItem').click(function() {
		var star = GLOBAL.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.setIndex($(this).attr('data-provider-index'));
	});
});

function showMoreResultOnMap(starName)
{
	
}