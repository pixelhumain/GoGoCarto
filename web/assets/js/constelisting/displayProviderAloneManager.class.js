function DisplayProviderAloneManager() 
{
	this.providerShownAlone_ = null;
}

DisplayProviderAloneManager.prototype.begin = function (providerId) 
{	
	if (this.providerShownAlone_ !== null) this.providerShownAlone_.isShownAlone = false;

	if (constellationMode) GLOBAL.getProviderManager().focusOnThesesProviders([providerId]);
	else 
	{
		var providers = GLOBAL.getProviderManager().getProviders();

		l = providers.length;
		//window.console.log("hiding providers nbre = " + l);
		while(l--)
		{
			providers[l].hide();
		}
	}	
	
	var provider = GLOBAL.getProviderManager().getProviderById(providerId); 
	this.providerShownAlone_ = provider;
	provider.show();

	provider.isShownAlone = true;

	document.title = provider.name + ' - Mon voisin fait du bio';

	showProviderInfosOnMap(providerId);

	var map = GLOBAL.getMap();
	setTimeout(function() { map.panTo(provider.getPosition());},0);
	map.setZoom(11);
};


DisplayProviderAloneManager.prototype.end = function () 
{	

	if (this.providerShownAlone_ === null) return;

	if (constellationMode) GLOBAL.getProviderManager().clearFocusOnThesesProviders([this.providerShownAlone_.getId()]);
	else GLOBAL.getProviderManager().updateProviderList(true,true);

	this.providerShownAlone_.isShownAlone = false;	

	this.providerShownAlone_ = null;	
};

