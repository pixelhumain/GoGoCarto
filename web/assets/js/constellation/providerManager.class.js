jQuery(document).ready(function()
{	
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
	$('.providerItem').hide();
	var providerId;
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		providerId = GLOBAL.getConstellation().getStars()[i].getProvider().id;
		$('#ProviderList #infoProvider-'+providerId).show();
	}

	$('#ProviderList').animate({scrollTop: '0'}, 500);
};

ProviderManager.prototype.focusOnThesesProviders = function (idList, starName) 
{
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		providerId = GLOBAL.getConstellation().getStars()[i].getProvider().id;
		$('#ProviderList #infoProvider-'+providerId).hide();
	}

	for(var i = 0; i < idList.length; i++)
	{
		$('#ProviderList #infoProvider-'+idList[i]).show();

		var star = GLOBAL.getConstellation().getStarFromName(starName);
		var providerIndex = star.getProviderIndexFromId(idList[i]);
		
		var content = document.createElement("div");
		$(content).attr('data-star-name',starName);
		$(content).attr('data-provider-index',providerIndex);
		$(content).addClass("moreChoiceInfo");
		$(content).html('<button class="btn waves-effect waves-light" >Sélectionner</button> en tant que "'+starName+'" principal');
		
		$(content).click(handleClickChooseProviderForStar);	

		$(content).prependTo('#ProviderList #infoProvider-'+idList[i]+' .collapsible-header');	
	}

	$('#ProviderList').animate({scrollTop: '0'}, 500);

};

ProviderManager.prototype.clearFocusOnThesesProviders = function (idList) 
{
	for(var i = 0; i < idList.length; i++)
	{
		$('#infoProvider-'+idList[i]).hide();
		$('#infoProvider-'+idList[i]+ ' .moreChoiceInfo').remove();		
	}

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