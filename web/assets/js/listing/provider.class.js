function Provider(providerPhp) 
{
	var provider = providerPhp['Provider'];
	
	this.id_ = provider.id;
	this.name_ = provider.name;
	this.position_ = new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
	this.address_ = provider.adresse;
	this.description_ = provider.description;	
	this.tel_ = provider.tel;
	this.products_ = provider.products;
	this.mainProduct_ = provider.main_product;
	this.horaires_ = provider.horaires;
	this.type_ = provider.type;	
	
	this.isInitialized_ = false;

	this.isVisible_ = false;

	this.biopenMarker_ = null;
	this.htmlRepresentation_ = '';
}

Provider.prototype.initialize = function () 
{		
	this.biopenMarker_ = new BiopenMarker(this.id_, this.position_);
	this.htmlRepresentation_ = '<span>'+this.name_ +'</span>'
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
	for (var i = 0; i < this.products_.length; i++) 
	{
		if (this.products_[i].product.name_formate == productName)
		{
			return true;
		} 
	}
	return false;
};




// --------------------------------------------
//            SETTERS GETTERS
// ---------------------------------------------

Provider.prototype.getId = function () 
{		
	return this.id_;
};

Provider.prototype.getPosition = function () 
{		
	return this.position_;
};

Provider.prototype.getName = function () 
{		
	return this.name_;
};

Provider.prototype.getMainProduct = function () 
{		
	return this.mainProduct_;
};

Provider.prototype.getProducts = function () 
{		
	return this.products_;
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

Provider.prototype.getHtmlRepresentation = function () 
{		
	return this.htmlRepresentation_;
};
