function Provider(provider) 
{	
	this.id = provider.id;
	this.name = provider.name;
	this.position = new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
	this.adresse = provider.adresse;
	this.description = provider.description;
	this.tel = provider.tel ? provider.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
	
	this.products = [];
	if (provider.type == 'epicerie') 
	{
		var product = [];

		product.name = 'Epicerie';
		product.nameShort = 'Epicerie';
		product.nameFormate = 'epicerie';

		this.products.push(product);
	}
	else
	{
		for (var i = 0; i < provider.products.length; i++) 
		{
			var product = [];

			product.name = provider.products[i].product.name;
			product.nameShort = provider.products[i].product.name_short;
			product.nameFormate = provider.products[i].product.name_formate;
			product.descriptif = provider.products[i].descriptif;

			this.products.push(product);
		};
	}

	this.mainProduct = provider.main_product;
	this.horaires = provider.horaires;
	this.type = provider.type;	

	this.distance = provider.distance ? Math.round(provider.distance*10)/10 : null; 
	
	this.isInitialized_ = false;

	this.isVisible_ = false;
	this.isInProviderList = false;

	this.biopenMarker_ = null;
	this.htmlRepresentation_ = '';
	this.formatedHoraire_ = null;

	this.productsToDisplay_ = [];

	this.starChoiceForRepresentation = '';

	// TODO delete providerPhp['Provider'] ?
}

Provider.prototype.initialize = function () 
{		
	this.biopenMarker_ = new BiopenMarker(this.id, this.position);
	this.isInitialized_ = true;
};

Provider.prototype.show = function () 
{		
	if (!this.isInitialized_) this.initialize();
	this.biopenMarker_.updateIcon();
	this.biopenMarker_.show();
	this.isVisible_ = true;

	if (constellationMode)
	{
		if (!this.isInProviderList)
		{
			$('#ProviderList ul').append(this.getHtmlRepresentation());
			createListenersForProviderMenu($('#infoProvider-'+this.id +' .menu-provider'));
			this.isInProviderList = true;			
		}
		else
		{
			$('#infoProvider-'+this.id).show();
		}
	}
		
};

Provider.prototype.hide = function () 
{		
	this.biopenMarker_.hide();
	this.isVisible_ = false;
	// unbound events (click etc...)?
	if (constellationMode) $('#ProviderList #infoProvider-'+this.id).hide();
};


Provider.prototype.getHtmlRepresentation = function () 
{		
	if (this.htmlRepresentation_ == '')
	{
		var html = Twig.render(providerTemplate, {provider : this, horaires : this.getFormatedHoraires(), constellationMode: constellationMode});
		this.htmlRepresentation_ = html;				
		return html;
		
	}
	else return this.htmlRepresentation_;
};

Provider.prototype.getProductsNameToDisplay = function ()
{
	this.productsToDisplay_.main = [];
	this.productsToDisplay_.others = [];

	var starNames = [];

	if (GLOBAL.constellationMode())
	{
		starNames = GLOBAL.getConstellation().getStarNamesRepresentedByProviderId(this.id);
	}

	// ICONS TO SHOW IN MARKER
	if (starNames.length > 0)
	{
		this.productsToDisplay_.main.value = starNames[0];				
		this.productsToDisplay_.main.disabled = false;
		
		if (starNames.length > 1)
		{
			starNames.splice(0,1);	
			for(var i = 0; i < starNames.length;i++)
			{
				this.pushToProductToDisplay(starNames[i], false);
			}
		}

		var productName;
		for(var i = 0; i < this.products.length;i++)
		{
			productName = this.products[i].nameFormate;			

			// si le produit n'a pas encore été ajouté, on l'ajoute avec "disabled"
			if ($.inArray(productName, starNames) == -1 && productName != this.productsToDisplay_.main.value)
			{
				this.pushToProductToDisplay(productName, true);
			}			
		}
	} 	
	else
	{
		// en constellation, un produit qui n'est pas représentant d'au moins
		// une étoile est noté "disabled"
		var disableProduct = GLOBAL.constellationMode();
		this.productsToDisplay_.main.disabled = disableProduct;

		this.productsToDisplay_.main.value = this.mainProduct;

		var productName;
		for(var i = 0; i < this.products.length;i++)
		{
			productName = this.products[i].nameFormate;
			if (productName != this.productsToDisplay_.main.value)
			{
				this.pushToProductToDisplay(productName, disableProduct);
			}			
		}	
	}

	return this.productsToDisplay_;	
};

Provider.prototype.pushToProductToDisplay = function(productName, disabled)
{
	var new_product = [];
	new_product.value = productName;
	new_product.disabled = disabled;
	this.productsToDisplay_.others.push(new_product);
};

Provider.prototype.getFormatedHoraires = function () 
{		
	if (this.formatedHoraire_ == null )
	{		
		this.formatedHoraire_ = {};
		var new_key;
		for(key in this.horaires)
		{
			new_key = key.split('_')[1];
			this.formatedHoraire_[new_key] = this.formateJourHoraire(this.horaires[key]);
		}
	}
	return this.formatedHoraire_;
};

Provider.prototype.formateJourHoraire = function (jourHoraire) 
{		
	if (jourHoraire == null)
	{		
		return 'fermé';
	}
	var result = '';
	if (jourHoraire.plage1debut != null)
	{
		result+= this.formateDate(jourHoraire.plage1debut);
		result+= ' - ';
		result+= this.formateDate(jourHoraire.plage1fin);
	}
	if (jourHoraire.plage2debut != null)
	{
		result+= ' et ';
		result+= this.formateDate(jourHoraire.plage2debut);
		result+= ' - ';
		result+= this.formateDate(jourHoraire.plage2fin);
	}
	return result;
};

Provider.prototype.formateDate = function (date) 
{		
	return date.split('T')[1].split(':00+0100')[0];
};

Provider.prototype.isProducteurOrAmap = function () 
{		
	return ($.inArray( this.type, [ "producteur", "amap" ] ) > -1);
};

Provider.prototype.isCurrentStarChoiceRepresentant = function () 
{		
	if ( this.starChoiceForRepresentation !='')
	{
		var providerStarId = GLOBAL.getConstellation().getStarFromName(this.starChoiceForRepresentation).getProviderId();
		return (this.id == providerStarId);
	}
	return false;	
};









// --------------------------------------------
//            SETTERS GETTERS
// ---------------------------------------------

Provider.prototype.getId = function () 
{		
	return this.id;
};

Provider.prototype.getPosition = function () 
{		
	return this.position;
};

Provider.prototype.getName = function () 
{		
	return this.name;
};

Provider.prototype.getMainProduct = function () 
{		
	return this.mainProduct;
};

Provider.prototype.getProducts = function () 
{		
	return this.products;
};

Provider.prototype.getMarker= function () 
{		
	return this.biopenMarker_.getRichMarker();
};

Provider.prototype.getBiopenMarker= function () 
{		
	return this.biopenMarker_;
};

Provider.prototype.isVisible = function () 
{		
	return this.isVisible_;
};

Provider.prototype.isInitialized = function () 
{		
	return this.isInitialized_;
};


