function DisplayProviderAloneManager() 
{
	this.providerShownAlone_ = null;
}

DisplayProviderAloneManager.prototype.begin = function (providerId, panToProviderLocation) 
{	
	panToProviderLocation = panToProviderLocation !== false;

	if (this.providerShownAlone_ !== null) 
	{
		this.providerShownAlone_.hide();
		this.providerShownAlone_.isShownAlone = false;
	}

	if (constellationMode) GLOBAL.getProviderManager().focusOnThesesProviders([providerId]);
	else 
	{
		var providers = GLOBAL.getProviderManager().getProviders();

		l = providers.length;
		while(l--)
		{
			providers[l].hide();
		}
	}	
	
	var provider = GLOBAL.getProviderManager().getProviderById(providerId); 
	this.providerShownAlone_ = provider;
	provider.show();	
	provider.isShownAlone = true;

	showProviderInfosOnMap(providerId);

	if (panToProviderLocation)
	{
		var map = GLOBAL.getMap();
		panMapToLocation(provider.getPosition(), map, false);
	}
};


DisplayProviderAloneManager.prototype.end = function () 
{	

	if (this.providerShownAlone_ === null) return;

	if (constellationMode) GLOBAL.getProviderManager().clearFocusOnThesesProviders([this.providerShownAlone_.getId()]);
	else 
	{
		this.providerShownAlone_.hide();
		GLOBAL.getProviderManager().updateProviderList(true,true);
	}
	
	this.providerShownAlone_.isShownAlone = false;	

	this.providerShownAlone_ = null;	
};

