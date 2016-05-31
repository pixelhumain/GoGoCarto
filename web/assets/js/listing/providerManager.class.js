function ProviderManager(listProviderPhp) 
{
	this.allProviders_ = [];
	this.currProviders_ = [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	var provider;
	for (var i = 0; i < listProviderPhp.length; i++)
	{
		provider = new Provider(listProviderPhp[i]['Provider']);
		this.allProviders_.push(provider);
	}

	// TODO delete listProviderPhp; ?
}

ProviderManager.prototype.updateProviderList = function (checkInAllProviders = true, forceRepaint = false) 
{	
	if (checkInAllProviders) var providers = this.allProviders_;
	else var providers = this.currProviders_;

	var i, provider;
	var mapBounds = GLOBAL.getMap().getBounds();

	var newMarkers = [];
	var markersToRemove = [];
	var markersChanged = false;
	//window.console.log("UPDATE PROVIDER LIST checkAll : " + checkInAllProviders + "| forceRepaint : " + forceRepaint);
	filterManager = GLOBAL.getFilterManager();

	
	i = providers.length;
	// TODO check temps avec for in au lieu de for classique
	while(i--)
	//for(var i = 0; i < l; i++)
	{
		provider = providers[i];
		
		if (mapBounds.contains(provider.getPosition()) && filterManager.checkIfProviderPassFilters(provider))
		{
			if (! provider.isVisible() )
			{
				if (provider.isInitialized() == false) provider.initialize();
				provider.show();
				this.currProviders_.push(provider);
				newMarkers.push(provider.getMarker());
				markersChanged = true;
			}
		}
		else
		{
			if (provider.isVisible()) 
			{
				provider.hide();
				markersToRemove.push(provider.getMarker());
				markersChanged = true;
				var index = this.currProviders_.indexOf(provider);
				if (index > -1) this.currProviders_.splice(index, 1);
				//l--;i--;
			}
		}
	}

	/*if (newMarkers.length > 0) GLOBAL.getClusterer().addMarkers(newMarkers);
	if (markersToRemove.length > 0) GLOBAL.getClusterer().removeMarkers(markersToRemove);*/	

	if (markersChanged || forceRepaint)
	{
		GLOBAL.getClusterer().clearMarkers();
		GLOBAL.getClusterer().addMarkers(this.getMarkers());
		GLOBAL.getClusterer().repaint();
	}	
};


ProviderManager.prototype.getProviders = function () 
{
	return this.currProviders_;
};

ProviderManager.prototype.getMarkers = function () 
{
	var markers = [];
	l = this.currProviders_.length;
	while(l--)
	{
		markers.push(this.currProviders_[l].getMarker());
	}
	return markers;
};

ProviderManager.prototype.getProviderById = function (providerId) 
{
	//return this.allProviders_[providerId];
	for (var i = 0; i < this.allProviders_.length; i++) {
		if (this.allProviders_[i].getId() == providerId) return this.allProviders_[i];
	};
};