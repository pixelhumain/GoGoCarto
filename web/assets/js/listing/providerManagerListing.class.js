/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-02
 */
function ProviderManagerListing(listProviderPhp) 
{
	this.allProviders_ = [];
	this.currProviders_ = [];

	this.allProvidersIds_= [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	cookies = readCookie('FavoriteIds');
	if (cookies !== null)
	{
		this.favoriteIds_ = JSON.parse(cookies);		
	}   
	else this.favoriteIds_ = [];	

	this.addJsonProviders(listProviderPhp, false);

	// TODO delete listProviderPhp; ?
}

ProviderManagerListing.prototype.checkCookies = function()
{
	for(var j = 0; j < this.favoriteIds_.length; j++)
  	{
  		this.addFavorite(this.favoriteIds_[j], false);
  	}
};

ProviderManagerListing.prototype.addJsonProviders = function (providerList, checkIfAlreadyExist)
{
	var provider;
	for (var i = 0; i < providerList.length; i++)
	{
		providerJson = providerList[i].Provider ? providerList[i].Provider : providerList[i];

		if (!checkIfAlreadyExist || this.allProvidersIds_.indexOf(providerJson.id) < 0)
		{
			this.allProviders_.push(new Provider(providerJson));
			this.allProvidersIds_.push(providerJson.id);
		}		
	}
	this.checkCookies();
};

ProviderManagerListing.prototype.addFavorite = function (favoriteId, modifyCookies)
{
	modifyCookies = modifyCookies !== false;
	var provider = this.getProviderById(favoriteId);
	if (provider !== null) provider.isFavorite = true;
	else return;
	
	if (modifyCookies)
	{
		this.favoriteIds_.push(favoriteId);
		createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));		
	}
};

ProviderManagerListing.prototype.removeFavorite = function (favoriteId, modifyCookies)
{
	modifyCookies = modifyCookies !== false;
	var provider = this.getProviderById(favoriteId);
	if (provider !== null) provider.isFavorite = false;
	
	if (modifyCookies)
	{
		var index = this.favoriteIds_.indexOf(favoriteId);
		if (index > -1) this.favoriteIds_.splice(index, 1);

		createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));
	}
};

ProviderManagerListing.prototype.updateProviderList = function (checkInAllProviders, forceRepaint) 
{	
	checkInAllProviders = checkInAllProviders !== false;
	forceRepaint = forceRepaint || false;

	var providers = null;
	if (checkInAllProviders || this.currProviders_.length === 0) providers = this.allProviders_;
	else providers = this.currProviders_;

	var i, provider;
   	var mapBounds = GLOBAL.getMap().getBounds();   

   	var newMarkers = [];
   	var markersToRemove = [];
   	var markersChanged = false;

	filterManager = GLOBAL.getFilterManager();

	i = providers.length;

	//window.console.log("UpdateProviderList nbre provider " + i);
	var start = new Date().getTime();

	var maxProviders = Math.min(Math.floor($('#map').width() * $('#map').height() / 1800), 1000);

	while(i-- && this.currProviders_.length < maxProviders)
	{
		provider = providers[i];
		
		if (mapBounds.contains(provider.getPosition()) && filterManager.checkIfProviderPassFilters(provider))
		{
			if (!provider.isVisible() && $.inArray(GLOBAL.getState(), ["normal","showProvider"]) > -1)
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
			}
		}
	}

	if (this.currProviders_.length >= maxProviders)
	{
		$('#tooManyMarkers_modal').show().fadeTo( 500 , 1);
		this.clearMarkers();		
		return;
	}
	else
	{
		$('#tooManyMarkers_modal:visible').fadeTo(600,0, function(){ $(this).hide(); });
	}

	var end = new Date().getTime();
	var time = end - start;
	//window.console.log("    analyse providers en " + time + " ms");	
	
	if (markersChanged || forceRepaint)
	{		
		GLOBAL.getClusterer().addMarkers(newMarkers,true);
		GLOBAL.getClusterer().removeMarkers(markersToRemove, true);
		
		GLOBAL.getClusterer().repaint();		
	}
	
};

ProviderManagerListing.prototype.getProviders = function () 
{
	return this.currProviders_;
};

ProviderManagerListing.prototype.clearMarkers = function()
{
	this.hideAllMarkers();
	this.currProviders_ = [];
	GLOBAL.getClusterer().clearMarkers();	
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

ProviderManagerListing.prototype.hideAllMarkers = function () 
{
	l = this.currProviders_.length;
	while(l--)
	{
		this.currProviders_[l].hide();
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
	return null;
};