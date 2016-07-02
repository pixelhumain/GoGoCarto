function FilterManager() 
{
	this.productFilters = [];
	this.typeFilters = [];
}

FilterManager.prototype.addProductFilter = function (productName) 
{	
	var index = this.productFilters.indexOf(productName);
	if ( index < 0)this.productFilters.push(productName);
};

FilterManager.prototype.addTypeFilter = function (type) 
{	
	var index = this.typeFilters.indexOf(type);
	if ( index < 0) this.typeFilters.push(type);
};

FilterManager.prototype.removeProductFilter = function (productName) 
{	
	var index = this.productFilters.indexOf(productName);
	if ( index > -1) this.productFilters.splice(index, 1);
};

FilterManager.prototype.removeTypeFilter = function (type) 
{	
	var index = this.typeFilters.indexOf(type);
	if ( index > -1) this.typeFilters.splice(index, 1);
};

FilterManager.prototype.checkIfProviderPassFilters = function (provider) 
{	
	var i;
	for (i = 0; i < this.typeFilters.length; i++) 
	{
		if (provider.type == this.typeFilters[i]) return false;
	}

	/*if (!provider.isProducteurOrAmap()) return true;*/
	if (provider.type =='epicerie') return true;

	var products = provider.getProducts();
	var atLeastOneProductPassFilter = false;
	var updateProviderIcon = false;
	for (i = 0; i < products.length; i++) 
	{
		if (!this.containsProduct(products[i].nameFormate)) 
		{
			atLeastOneProductPassFilter = true;
			if (products[i].disabled)
			{
				products[i].disabled = false;
				if (products[i].nameFormate == provider.mainProduct) provider.mainProductIsDisabled = false;
				updateProviderIcon = true;
			} 
		}
		else
		{
			if (!products[i].disabled) 
			{
				products[i].disabled = true;
				if (products[i].nameFormate == provider.mainProduct) provider.mainProductIsDisabled = true;
				updateProviderIcon = true;
			}
		}			
	}	

	if (updateProviderIcon && atLeastOneProductPassFilter) provider.getBiopenMarker(true).updateIcon();
	return atLeastOneProductPassFilter;
};

FilterManager.prototype.containsProduct = function (productName) 
{		
	for (var i = 0; i < this.productFilters.length; i++) 
	{
		if (this.productFilters[i] == productName)
		{
			return true;
		} 
	}
	return false;
};