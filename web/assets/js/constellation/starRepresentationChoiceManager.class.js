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
	$('.starRepresentationChoice-helper').show();
	
	ajuster_taille_providerList();

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

	ajuster_taille_providerList();

	GLOBAL.setState('normal');
};

StarRepresentationChoiceManager.prototype.selectProviderIndex = function (providerIndex) 
{
	this.currentStar_.setIndex(providerIndex);
	
	$('.moreResultContainer:visible .starProvider').removeClass('starProvider');
	$('#moreResult-'+this.currentStar_.getName()+'-'+providerIndex).addClass("starProvider");
}

StarRepresentationChoiceManager.prototype.selectProviderById = function (providerId)
{
	var providerIndex = this.currentStar_.getProviderIndexFromId(providerId)
	this.selectProviderIndex(providerIndex);
} 

