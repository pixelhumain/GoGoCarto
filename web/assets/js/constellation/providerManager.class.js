jQuery(document).ready(function()
{	
	$('#ProviderList .btn-select-as-representant').click(function(event) 
	{ 
		var providerId = $(this).closest('.providerItem').attr('data-provider-id');
		GLOBAL.getSRCManager().selectProviderById( providerId ); 		
	});

	$('#bandeau_detail .btn-select-as-representant').click(function(event) 
	{ 
		var providerId = $('#bandeau_detail .providerItem').attr('data-provider-id');
		GLOBAL.getSRCManager().selectProviderById( providerId ); 		
	});
});

function ProviderManager(listProvider) 
{
	this.providers_ = listProvider;
	for (var i = 0; i < listProvider.length; i++) 
	{
		for (var j = 0; j < listProvider[i].products.length; j++) 
		{
			var product = listProvider[i].products[j];
			product.name = product.product.name;
			product.nameFormate = product.product.name_formate;
			product.nameShort = product.product.name_short;
		};

		listProvider[i].mainProduct = listProvider[i].main_product;
	};
}

ProviderManager.prototype.draw = function () 
{	
	this.clearProviderList();

	var providerId;
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		providerId = GLOBAL.getConstellation().getStars()[i].getProvider().id;
		$('#ProviderList #infoProvider-'+providerId).show();
	}

	$('#ProviderList ul').animate({scrollTop: '0'}, 500);
};

ProviderManager.prototype.focusOnThesesProviders = function (idList) 
{
	this.clearProviderList();
	var infoProvider;

	for(var i = 0; i < idList.length; i++)
	{
		infoProvider = $('#ProviderList #infoProvider-'+idList[i]);
		infoProvider.show();
		infoProvider.find('.btn-select-as-representant-container').show();
		infoProvider.find('.moreInfos').hide();
	}

	$('#ProviderList ul').animate({scrollTop: '0'}, 500);
};

ProviderManager.prototype.clearProviderList = function ()
{
	$('#ProviderList .providerItem').hide();
} 

ProviderManager.prototype.clearFocusOnThesesProviders = function () 
{
	$('#ProviderList .btn-select-as-representant-container').hide();
	$('#ProviderList .moreInfos').show();
	this.draw();
};

// enlève un des provider de la liste,en vérifiant s'il n'est pas utile pour
// une autre étoile.
// return false si pas supprimé, true sinon
ProviderManager.prototype.removeProvider = function (providerId) 
{
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		if (GLOBAL.getConstellation().getStars()[i].getProviderId() == providerId) return false
	}
	
	$('#infoProvider-'+providerId).hide();

	return true;
};

ProviderManager.prototype.addProvider = function (providerId) 
{
	$('#infoProvider-'+providerId).show();
};

ProviderManager.prototype.getProviders = function () 
{
	return this.providers_;
};


ProviderManager.prototype.getProviderById = function (providerId) 
{
	for(var i = 0; i < this.providers_.length; i++)
	{
		if (this.providers_[i].id == providerId) return this.providers_[i]
	}
	return null;
};