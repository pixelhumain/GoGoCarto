function Provider(provider) 
{	
	this.id = provider.id;
	this.name = provider.name;
	this.position = new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
	this.adresse = provider.adresse;
	this.description = provider.description;
	this.tel = provider.tel ? provider.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
	
	this.products = [];
	var product;
	if (provider.type == 'epicerie') 
	{
		product = [];

		product.name = 'Epicerie';
		product.nameShort = 'Epicerie';
		product.nameFormate = 'epicerie';

		this.products.push(product);
	}
	else
	{
		for (var i = 0; i < provider.products.length; i++) 
		{
			product = [];

			product.name = provider.products[i].product.name;
			product.nameShort = provider.products[i].product.name_short;
			product.nameFormate = provider.products[i].product.name_formate;
			product.descriptif = provider.products[i].descriptif;
			product.disabled = false;

			this.products.push(product);
		}
	}

	this.mainProduct = provider.main_product;
	this.mainProductIsDisabled = false;
	this.horaires = provider.horaires;
	this.type = provider.type;	

	this.distance = provider.distance ? Math.round(provider.distance*10)/10 : null;
	this.wastedDistance = provider.wasted_distance ? Math.round(provider.wasted_distance*10)/10 : null;  
	
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
};

Provider.prototype.hide = function () 
{		
	this.biopenMarker_.hide();
	this.isVisible_ = false;
	// unbound events (click etc...)?
	//if (constellationMode) $('#ProviderList #infoProvider-'+this.id).hide();
};

Provider.prototype.updateProductsRepresentation = function () 
{		
	if (!constellationMode) return;

	var starNames = GLOBAL.getConstellation().getStarNamesRepresentedByProviderId(this.id);
	if (this.isProducteurOrAmap())
	{
		for(i = 0; i < this.products.length;i++)
		{
			productName = this.products[i].nameFormate;			

			if ($.inArray(productName, starNames) == -1)
			{
				this.products[i].disabled = true;				
				if (productName == this.mainProduct) this.mainProductIsDisabled = true;				
			}	
			else
			{
				this.products[i].disabled = false;				
				if (productName == this.mainProduct) this.mainProductIsDisabled = false;		
			}		
		}
	}
	else
	{
		if (starNames.length == 0) this.mainProductIsDisabled = true;	
		else this.mainProductIsDisabled = false;	
	}
};

Provider.prototype.getHtmlRepresentation = function () 
{	
	var starNames = constellationMode ? GLOBAL.getConstellation().getStarNamesRepresentedByProviderId(this.id) : [];
	var html = Twig.render(providerTemplate, 
				{
					provider : this, 
					horaires : this.getFormatedHoraires(), 
					constellationMode: constellationMode, 
					productsToDisplay: this.getProductsNameToDisplay(), 
					starNames : starNames 
				});
	this.htmlRepresentation_ = html;				
	return html;
};

Provider.prototype.getProductsNameToDisplay = function ()
{
	this.updateProductsRepresentation();

	this.productsToDisplay_.main = [];
	this.productsToDisplay_.others = [];
	var productName;

	if (!this.mainProductIsDisabled || !this.isProducteurOrAmap())
	{
		this.productsToDisplay_.main.value = this.mainProduct;				
		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;		
	}		

	var productIsDisabled;
	for(var i = 0; i < this.products.length;i++)
	{
		productName = this.products[i].nameFormate;
		productIsDisabled = this.products[i].disabled;
		if (productName != this.productsToDisplay_.main.value)
		{
			// si le main product est disabled, on choppe le premier produit
			// non disable et on le met en produit principal
			if (!productIsDisabled && !this.productsToDisplay_.main.value)
			{
				this.productsToDisplay_.main.value = productName;				
				this.productsToDisplay_.main.disabled = productIsDisabled;				
			}
			else
			{
				this.pushToProductToDisplay(productName, productIsDisabled);
			}				
		}			
	}

	// si on a tjrs pas de mainProduct (ils sont tous disabled)
	if (!this.productsToDisplay_.main.value)	
	{
		this.productsToDisplay_.main.value = this.mainProduct;				
		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;

		this.productsToDisplay_.others.splice(0,1);
	}	

	this.productsToDisplay_.others.sort(compareProductsDisabled);	

	return this.productsToDisplay_;
};

function compareProductsDisabled(a,b) 
{  
  if (a.disabled == b.disabled) return 0;
  return a.disabled ? 1 : -1;
}

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


