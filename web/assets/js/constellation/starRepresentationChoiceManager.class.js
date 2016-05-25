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

	GLOBAL.getMarkerManager().focusOnThesesMarkers(idToFocus,star.getName());
	GLOBAL.getProviderManager().focusOnThesesProviders(idToFocus);
	GLOBAL.getClusterer().repaint();

	$('.SRC-helper-starName').html(star.getName());
	$('.starRepresentationChoice-helper').show();
	
	ajuster_taille_composants();

	hideBandeauHelper();
};


StarRepresentationChoiceManager.prototype.end = function () 
{	
	var idToClearFocus = this.currentStar_.getProviderListId();

	GLOBAL.getMarkerManager().clearFocusOnThesesMarkers(idToClearFocus);
	GLOBAL.getProviderManager().clearFocusOnThesesProviders();
	GLOBAL.getClusterer().repaint();	
	animate_down_bandeau_detail(); 

	$('.starRepresentationChoice-helper').hide();

	ajuster_taille_composants()	

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

