/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function FilterModule() 
{
	this.productFilters = [];
	this.typeFilters = [];	
	this.dayFilters = [];	
	this.showOnlyFavorite_ = false;
}

FilterModule.prototype.showOnlyFavorite = function(data)
{
	this.showOnlyFavorite_ = data;
};

FilterModule.prototype.addFilter = function (data, filterType, updateElementList) 
{	
	var listToFilter = this.getFilterListFromType(filterType);

	var index = listToFilter.indexOf(data);
	if ( index < 0) listToFilter.push(data);

	if (updateElementList) App.getElementModule().updateElementList(false);
};

FilterModule.prototype.removeFilter = function (data, filterType, updateElementList) 
{	
	var listToFilter = this.getFilterListFromType(filterType);

	var index = listToFilter.indexOf(data);
	if ( index > -1) 
	{
		listToFilter.splice(index, 1);
		if (updateElementList) App.getElementModule().updateElementList(true);
	}
};

FilterModule.prototype.getFilterListFromType = function(type)
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

FilterModule.prototype.checkIfElementPassFilters = function (element) 
{	
	// FAVORITE FILTER
	if (this.showOnlyFavorite_ && !element.isFavorite) return false;

	// TYPE FILTER
	var i;
	for (i = 0; i < this.typeFilters.length; i++) 
	{
		if (element.type == this.typeFilters[i]) return false;
	}

	// PRODUCTS FILTER
	var atLeastOneProductPassFilter = false;

	// si epicerie on ne fait irne
	if (element.type == 'epicerie') 
	{
		atLeastOneProductPassFilter = true;
	}
	else
	{
		var products = element.getProducts();
		
		var updateElementIcon = false;
		for (i = 0; i < products.length; i++) 
		{
			if (!this.containsProduct(products[i].nameFormate)) 
			{
				atLeastOneProductPassFilter = true;
				if (products[i].disabled)
				{
					products[i].disabled = false;
					if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = false;
					updateElementIcon = true;
				} 
			}
			else
			{
				if (!products[i].disabled) 
				{
					products[i].disabled = true;
					if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = true;
					updateElementIcon = true;
				}
			}			
		}	

		if (updateElementIcon && atLeastOneProductPassFilter) element.getBiopenMarker(true).updateIcon();
	}

	if (!atLeastOneProductPassFilter) return false;
	

	// OPENNING HOURS FILTER
	if (this.dayFilters.length > 0)
	{
		var horaires = element.horaires;
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

FilterModule.prototype.containsProduct = function (productName) 
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

FilterModule.prototype.containsOpeningDay = function (day) 
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