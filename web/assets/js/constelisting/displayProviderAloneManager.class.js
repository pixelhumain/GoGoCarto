/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-02
 */
function DisplayProviderAloneManager() 
{
	this.providerShownAlone_ = null;
}

DisplayProviderAloneManager.prototype.begin = function (providerId, panToProviderLocation) 
{	
	//window.console.log("DisplayProviderAloneManager begin");

	panToProviderLocation = panToProviderLocation !== false;

	if (this.providerShownAlone_ !== null) 
	{
		this.providerShownAlone_.hide();
		this.providerShownAlone_.isShownAlone = false;
	}

	if (constellationMode) GLOBAL.getProviderManager().focusOnThesesProviders([providerId]);
	else 
	{
		/*var providers = GLOBAL.getProviderManager().getProviders();

		l = providers.length;
		//window.console.log("hiding " + l + "providers");
		while(l--)
		{
			providers[l].hide();
		}

		var clusters = GLOBAL.getClusterer().getClusters();
		l = clusters.length
		while(l--)
		{
			clusters[l].hide();
		}*/

		GLOBAL.getProviderManager().clearMarkers();
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

