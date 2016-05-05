function FilterManager() 
{
	this.productFilters = [];
	this.typeFilters = [];
}

FilterManager.prototype.addProductFilter = function (productName) 
{	
	this.productFilters.push(productName);
};

FilterManager.prototype.addTypeFilter = function (type) 
{	
	this.typeFilters.push(type);
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
	for (var i = 0; i < this.productFilters.length; i++) 
	{
		if (provider.containsProduct(this.productFilters[i])) return false;
	}

	for (var i = 0; i < this.typeFilters.length; i++) 
	{
		if (provider.type == this.typeFilters[i]) return false;
	}

	return true;
};