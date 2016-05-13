function Provider(providerPhp) 
{
	var provider = providerPhp['Provider'];
	
	this.id = provider.id;
	this.name = provider.name;
	this.position = new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
	this.address = provider.adresse;
	this.description = provider.description;	
	this.tel = provider.tel;
	this.products = provider.products;
	this.mainProduct = provider.main_product;
	this.horaires = provider.horaires;
	this.type = provider.type;	
	
	this.isInitialized_ = false;

	this.isVisible_ = false;

	this.biopenMarker_ = null;
	this.htmlRepresentation_ = '';

	// TODO delete providerPhp['Provider'] ?
}

Provider.prototype.initialize = function () 
{		
	this.biopenMarker_ = new BiopenMarker(this.id, this.position);
	/*this.htmlRepresentation_ = '<span>'+this.name_ +'</span>';*/
	this.isInitialized_ = true;
};

Provider.prototype.show = function () 
{		
	this.biopenMarker_.show();
	this.isVisible_ = true;
};

Provider.prototype.hide = function () 
{		
	this.biopenMarker_.hide();
	this.isVisible_ = false;
	// unbound events (click etc...)?
};

Provider.prototype.containsProduct = function (productName) 
{		
	for (var i = 0; i < this.products.length; i++) 
	{
		if (this.products[i].product.name_formate == productName)
		{
			return true;
		} 
	}
	return false;
};

Provider.prototype.getHtmlRepresentation = function () 
{		
	if (this.htmlRepresentation_ == '')
	{
		
		var html = Twig.render(providerTemplate, {provider : this});
		this.htmlRepresentation_ = html;
		return html;
		
	}
	else return this.htmlRepresentation_;
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

Provider.prototype.isVisible = function () 
{		
	return this.isVisible_;
};

Provider.prototype.isInitialized = function () 
{		
	return this.isInitialized_;
};


