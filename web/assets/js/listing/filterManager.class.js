function FilterManager() 
{
	this.productFilters = [];
	this.typeFilters = [];
}

FilterManager.prototype.addProductFilter = function (productName) 
{	
	var index = this.productFilters.indexOf(productName)
	if ( index < 0)this.productFilters.push(productName);
};

FilterManager.prototype.addTypeFilter = function (type) 
{	
	var index = this.typeFilters.indexOf(type)
	if ( index < 0) this.typeFilters.push(type);
};

FilterManager.prototype.removeProductFilter = function (productName) 
{	
	var index = this.productFilters.indexOf(productName)
	if ( index > -1) this.productFilters.splice(index, 1);
};

FilterManager.prototype.removeTypeFilter = function (type) 
{	
	var index = this.typeFilters.indexOf(type)
	if ( index > -1) this.typeFilters.splice(index, 1);
};

FilterManager.prototype.checkIfProviderPassFilters = function (provider) 
{	
	for (var i = 0; i < this.typeFilters.length; i++) 
	{
		if (provider.type == this.typeFilters[i]) return false;
	}

	if (provider.type =='epicerie') return true;

	var products = provider.getProducts()
	for (var i = 0; i < products.length; i++) 
	{
		if (!this.containsProduct(products[i].nameFormate)) return true;
	}	

	return false;
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