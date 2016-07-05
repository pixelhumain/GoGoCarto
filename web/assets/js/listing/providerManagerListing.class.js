function ProviderManagerListing(listProviderPhp) 
{
	this.allProviders_ = [];
	this.currProviders_ = [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	var provider;
	for (var i = 0; i < listProviderPhp.length; i++)
	{
		provider = new Provider(listProviderPhp[i].Provider);
		this.allProviders_.push(provider);
	}

	// TODO delete listProviderPhp; ?
}

ProviderManagerListing.prototype.updateProviderList = function (checkInAllProviders, forceRepaint) 
{	
	checkInAllProviders = checkInAllProviders || true;
	forceRepaint = forceRepaint || false;

	var providers = null;
	if (checkInAllProviders) providers = this.allProviders_;
	else providers = this.currProviders_;

	var i, provider;
	var mapBounds = GLOBAL.getMap().getBounds();

	var newMarkers = [];
	var markersToRemove = [];
	var markersChanged = false;

	filterManager = GLOBAL.getFilterManager();

	i = providers.length;
	// TODO check temps avec for in au lieu de for classique
	while(i--)
	//for(var i = 0; i < l; i++)
	{
		provider = providers[i];
		
		if (mapBounds.contains(provider.getPosition()) && filterManager.checkIfProviderPassFilters(provider))
		{
			if (! provider.isVisible() && GLOBAL.getState() == "normal")
			{
				if (provider.isInitialized() === false) provider.initialize();
				provider.show();
				this.currProviders_.push(provider);
				newMarkers.push(provider.getMarker());
				markersChanged = true;
			}
		}
		else
		{
			if (provider.isVisible() && !provider.isShownAlone ) 
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

	if (markersChanged || forceRepaint)
	{
		GLOBAL.getClusterer().clearMarkers();
		GLOBAL.getClusterer().addMarkers(this.getMarkers());
		GLOBAL.getClusterer().repaint();
	}	
};

ProviderManagerListing.prototype.getProviders = function () 
{
	return this.currProviders_;
};

ProviderManagerListing.prototype.getMarkers = function () 
{
	var markers = [];
	l = this.currProviders_.length;
	while(l--)
	{
		markers.push(this.currProviders_[l].getMarker());
	}
	return markers;
};

ProviderManagerListing.prototype.hidePartiallyAllMarkers = function () 
{
	l = this.currProviders_.length;
	while(l--)
	{
		this.currProviders_[l].getBiopenMarker().showHalfHidden();
	}
};

ProviderManagerListing.prototype.showNormalHiddenAllMarkers = function () 
{
	l = this.allProviders_.length;
	while(l--)
	{
		this.currProviders_[l].getBiopenMarker().showNormalHidden();
	}
};

ProviderManagerListing.prototype.getProviderById = function (providerId) 
{
	//return this.allProviders_[providerId];
	for (var i = 0; i < this.allProviders_.length; i++) {
		if (this.allProviders_[i].getId() == providerId) return this.allProviders_[i];
	}
};