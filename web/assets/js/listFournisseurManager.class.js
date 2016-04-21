jQuery(document).ready(function()
{	
});

function ListFournisseurManager() 
{
	
}

ListFournisseurManager.prototype.draw = function () 
{
	
	$('.fournisseurItem').hide();
	var fournisseurId;
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		fournisseurId = GLOBAL.getConstellation().getStars()[i].getFournisseur().id;
		$('#infoFournisseur-'+fournisseurId).show();
	}
};

// enlève un des fournisseur de la liste,en vérifiant s'il n'est pas utile pour
// une autre étoile.
// return false si pas supprimé, true sinon
ListFournisseurManager.prototype.removeFournisseur = function (fournisseurId) 
{
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
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