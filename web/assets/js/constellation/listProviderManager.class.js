function ListProviderManager() 
{
	
}

ListProviderManager.prototype.draw = function () 
{
	$('#ProviderList li').remove();

	var provider, providersPlacesToDisplay = [], providersProducteurOrAmapToDisplay = [];
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		provider = GLOBAL.getConstellation().getStars()[i].getProvider();
		if (provider.isProducteurOrAmap())
		{
			if (providersProducteurOrAmapToDisplay.indexOf(provider) == -1) providersProducteurOrAmapToDisplay.push(provider);
		}			
		else
		{
			if (providersPlacesToDisplay.indexOf(provider) == -1) providersPlacesToDisplay.push(provider);
		}
			
	}

	providersProducteurOrAmapToDisplay.sort(compareDistance);
	providersPlacesToDisplay.sort(compareDistance);		

	for(var i = 0; i < providersPlacesToDisplay.length; i++)
	{
		provider = providersPlacesToDisplay[i];
		$('#ProviderList #places-end-container').before(provider.getHtmlRepresentation());
		createListenersForProviderMenu($('#infoProvider-'+provider.id +' .menu-provider'));	
	}

	for(var i = 0; i < providersProducteurOrAmapToDisplay.length; i++)
	{
		provider = providersProducteurOrAmapToDisplay[i];
		$('#ProviderList #producteurAmap-end-container').before(provider.getHtmlRepresentation());
		createListenersForProviderMenu($('#infoProvider-'+provider.id +' .menu-provider'));	
	}	

	$('#ProviderList ul').animate({scrollTop: '0'}, 500).collapsible({
      accordion : true 
    });
	
};

function compareDistance(a,b) 
{  
  if (a.distance == b.distance) return 0;
  return a.distance < b.distance ? -1 : 1;
}

