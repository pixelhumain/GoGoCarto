function FilterManager() 
{
	this.productFilters = [];
	this.typeFilters = [];	
	this.dayFilters = [];	
	this.showOnlyFavorite_ = false;
}

FilterManager.prototype.showOnlyFavorite = function(data)
{
	this.showOnlyFavorite_ = data;
};

FilterManager.prototype.addFilter = function (data, filterType, updateProviderList) 
{	
	var listToFilter = this.getFilterListFromType(filterType);

	var index = listToFilter.indexOf(data);
	if ( index < 0) listToFilter.push(data);

	if (updateProviderList) GLOBAL.getProviderManager().updateProviderList(false);
};

FilterManager.prototype.removeFilter = function (data, filterType, updateProviderList) 
{	
	var listToFilter = this.getFilterListFromType(filterType);

	var index = listToFilter.indexOf(data);
	if ( index > -1) 
	{
		listToFilter.splice(index, 1);
		if (updateProviderList) GLOBAL.getProviderManager().updateProviderList(true);
	}
};

FilterManager.prototype.getFilterListFromType = function(type)
{
	var listToFilter = null;

	switch (type)
	{
		case 'type': listToFilter = this.typeFilters; break;
		case 'product': listToFilter = this.productFilters; break;
		case 'day': listToFilter = this.dayFilters; break;
	}

	return listToFilter;
};

FilterManager.prototype.checkIfProviderPassFilters = function (provider) 
{	
	// FAVORITE FILTER
	if (this.showOnlyFavorite_ && !provider.isFavorite) return false;

	// TYPE FILTER
	var i;
	for (i = 0; i < this.typeFilters.length; i++) 
	{
		if (provider.type == this.typeFilters[i]) return false;
	}

	// PRODUCTS FILTER
	var atLeastOneProductPassFilter = false;

	// si epicerie on ne fait irne
	if (provider.type == 'epicerie') 
	{
		atLeastOneProductPassFilter = true;
	}
	else
	{
		var products = provider.getProducts();
		
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
	}

	if (!atLeastOneProductPassFilter) return false;
	

	// OPENNING HOURS FILTER
	if (this.dayFilters.length > 0)
	{
		var horaires = provider.horaires;
		var day, atLeastOneDayPassFilter = false;
		for(var key in horaires)
		{
			day = key.split('_')[1];
			if ( !this.containsOpeningDay(day) )
			{
				atLeastOneDayPassFilter = true;
			}
		}

		return atLeastOneDayPassFilter;
	}
	return true;
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

FilterManager.prototype.containsOpeningDay = function (day) 
{		
	for (var i = 0; i < this.dayFilters.length; i++) 
	{
		if (this.dayFilters[i] == day)
		{
			return true;
		} 
	}
	return false;
};