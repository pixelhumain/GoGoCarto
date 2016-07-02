function StarRepresentationChoiceManager() 
{
	this.currentStar_ = null;
	this.idFocused_ = null;
}

StarRepresentationChoiceManager.prototype.begin = function (star) 
{	
	this.currentStar_ = star;
	var idToFocus = star.getProviderListId();

	GLOBAL.setState('starRepresentationChoice');

	GLOBAL.getMarkerManager().hidePartiallyAllMarkers();

	GLOBAL.getProviderManager().focusOnThesesProviders(star.getName(), idToFocus);
	GLOBAL.getClusterer().repaint();

	$('.SRC-helper-starName').html(star.getName());
	$('#bandeau_detail').addClass('starRepresentantMode'),
	$('.starRepresentationChoice-helper').show();

	this.majView();	

	hideBandeauHelper();
};


StarRepresentationChoiceManager.prototype.end = function () 
{	
	var idToClearFocus = this.currentStar_.getProviderListId();

	GLOBAL.getMarkerManager().showNormalHiddenAllMarkers();

	GLOBAL.getProviderManager().clearFocusOnThesesProviders(idToClearFocus);
	GLOBAL.getClusterer().repaint();	

	animate_down_bandeau_detail(); 

	$('.starRepresentationChoice-helper').hide();
	$('#bandeau_detail').removeClass('starRepresentantMode'),

	ajuster_taille_providerList();

	GLOBAL.setState('normal');
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
	var providerIndex = this.currentStar_.getProviderIndexFromId(providerId)
	this.selectProviderIndex(providerIndex);
} ;

