function StarRepresentationChoiceManager() 
{
	this.currentStar_ = null;
	this.idFocused_ = null;
}

StarRepresentationChoiceManager.prototype.begin = function (star) 
{	
	this.currentStar_ = star;
	var idToFocus = star.getProviderListId();

	var provider;
	for(var i = 0; i < idToFocus.length; i++)
	{
		provider = GLOBAL.getProviderManager().getProviderById(idToFocus[i]);
		provider.starChoiceForRepresentation = star.getName();	
	}

	GLOBAL.setState('starRepresentationChoice');

	GLOBAL.getProviderManager().focusOnThesesProviders(idToFocus);
	GLOBAL.getClusterer().repaint();

	//$('.SRC-helper-starName').html(star.getName());
	//$('#bandeau_detail').addClass('starRepresentantMode');
	//$('.starRepresentationChoice-helper').show();

	this.majView();	

	hideBandeauHelper();
};


StarRepresentationChoiceManager.prototype.end = function () 
{	
	if (this.currentStar_ === null) return;

	var idToClearFocus = this.currentStar_.getProviderListId();

	var provider;
	for(var i = 0; i < idToClearFocus.length; i++)
	{
		provider = GLOBAL.getProviderManager().getProviderById(idToClearFocus[i]);
		provider.starChoiceForRepresentation = '';	
	}

	GLOBAL.getProviderManager().clearFocusOnThesesProviders(idToClearFocus);
	GLOBAL.getClusterer().repaint();	

	animate_down_bandeau_detail(); 

	this.currentStar_ = null;

	//$('.starRepresentationChoice-helper').hide();
	//$('#bandeau_detail').removeClass('starRepresentantMode');

	//ajuster_taille_providerList();

	//GLOBAL.setState('normal');
};

StarRepresentationChoiceManager.prototype.selectProviderIndex = function (providerIndex) 
{
	this.currentStar_.setIndex(providerIndex);
	showProviderInfosOnMap(this.currentStar_.getProviderId(), false);
	this.majView();	
};

StarRepresentationChoiceManager.prototype.majView = function ()
{
	var providerId = this.currentStar_.getProviderId();

	/*$('#ProviderList .starRepresentant').removeClass('starRepresentant');
	$('#ProviderList #infoProvider-'+providerId).addClass('starRepresentant');*/

	$('.moreResultContainer:visible .starProvider').removeClass('starProvider');
	$('#moreResult-'+this.currentStar_.getName()+'-'+this.currentStar_.getIndex()).addClass("starProvider");	
};

StarRepresentationChoiceManager.prototype.selectProviderById = function (providerId)
{
	var providerIndex = this.currentStar_.getProviderIndexFromId(providerId);	
	this.selectProviderIndex(providerIndex);
};

