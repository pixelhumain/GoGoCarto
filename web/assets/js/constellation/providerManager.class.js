jQuery(document).ready(function()
{	
	$('#bandeau_detail .btn-select-as-representant').click(function(event) 
	{ 
		var providerId = $('#bandeau_detail .providerItem').attr('data-provider-id');
		GLOBAL.getSRCManager().selectProviderById( providerId ); 		
	});
});

function ProviderManager(listProviderPhp) 
{
	this.providers_ = [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	var provider;
	for (var i = 0; i < listProviderPhp.length; i++)
	{
		provider = new Provider(listProviderPhp[i]);
		this.providers_.push(provider);
	}
}

ProviderManager.prototype.draw = function () 
{	
	var provider;
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		provider = GLOBAL.getConstellation().getStars()[i].getProvider();	
		provider.show();	
	}	
};

ProviderManager.prototype.focusOnThesesProviders = function (idList) 
{
	GLOBAL.getMarkerManager().hidePartiallyAllMarkers();

	var provider;	

	for(var i = 0; i < idList.length; i++)
	{
		provider = this.getProviderById(idList[i]);			
		provider.getBiopenMarker().updateIcon();
		provider.getBiopenMarker().showNormalHidden();				
		provider.show();		
	}
};

ProviderManager.prototype.clearFocusOnThesesProviders = function (idList) 
{
	GLOBAL.getMarkerManager().showNormalHiddenAllMarkers();

	var marker;
	for(var i = 0; i < idList.length; i++)
	{
		provider = this.getProviderById(idList[i]);	
		//marker.updateIcon();		
		provider.hide();		
	}

	this.draw();
};

ProviderManager.prototype.getProviders = function () 
{
	return this.providers_;
};

ProviderManager.prototype.getProviderById = function (providerId) 
{
	for (var i = 0; i < this.providers_.length; i++) 
	{
		if (this.providers_[i].getId() == providerId) return this.providers_[i];
	}
};