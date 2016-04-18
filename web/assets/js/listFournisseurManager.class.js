jQuery(document).ready(function()
{	
	$('.fournisseurPreviousButton').click(handlePreviousButton);
	$('.fournisseurNextButton').click(handleNextButton);
});

function handlePreviousButton()
{
	var star = GLOBAL.getConstellation().getStarFromName($(this).attr("data-star-name"));
	if (star != null) star.indexBackward();
}

function handleNextButton()
{
	var star = GLOBAL.getConstellation().getStarFromName($(this).attr("data-star-name"));
	if (star != null) star.indexForward();
}

function ListFournisseurManager() 
{
	
}


// enlève un des fournisseur de la liste,en vérifiant s'il n'est pas utile pour
// une autre étoile.
// return false si pas supprimé, true sinon
ListFournisseurManager.prototype.removeFournisseur = function (fournisseurId) 
{
	for(var i = 0; i < GLOBAL.getConstellation().getStars(); i++)
	{
		if (GLOBAL.getConstellation().getStars()[i].getFournisseur().id == fournisseurId) return false
	}
	
	$('#infoFournisseur-'+fournisseurId).hide();

	return true;
};

ListFournisseurManager.prototype.addFournisseur = function (fournisseurId) 
{
	$('#infoFournisseur-'+fournisseurId).show();
};