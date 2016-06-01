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
	this.clearProviderList();

	var provider;
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		provider = GLOBAL.getConstellation().getStars()[i].getProvider();	
		provider.show();	
	}

	this.initProviderList();
	
};

ProviderManager.prototype.initProviderList = function ()
{
	$('#ProviderList ul').animate({scrollTop: '0'}, 500).collapsible({
      accordion : true 
    });

	var that = this;
    $('#ProviderList .providerItem').mouseenter(function() 
	{
		var provider = that.getProviderById($(this).attr('data-provider-id'));
		provider.getBiopenMarker().showBigSize();
	}).mouseleave(function() 
	{
		var provider = that.getProviderById($(this).attr('data-provider-id'));
		provider.getBiopenMarker().showNormalSize();
	});

	$('#ProviderList .providerItem').click(function()
	{
		$('#ProviderList ul').animate({scrollTop: '+='+$(this).position().top}, 500);
	});
};

ProviderManager.prototype.focusOnThesesProviders = function (idList) 
{
	this.clearProviderList();
	var provider;

	for(var i = 0; i < idList.length; i++)
	{
		provider = this.getProviderById(idList[i]);		
		provider.show();		
	}

	$('#ProviderList .btn-select-as-representant-container').show();
	$('#ProviderList .moreInfos').hide();

	this.initProviderList();

    $('#ProviderList .btn-select-as-representant').click(function(event) 
	{ 
		var providerId = $(this).closest('.providerItem').attr('data-provider-id');
		GLOBAL.getSRCManager().selectProviderById( providerId ); 
		return false;		
	});	
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
	for (var i = 0; i < this.providers_.length; i++) 
	{
		if (this.providers_[i].getId() == providerId) return this.providers_[i];
	};
};