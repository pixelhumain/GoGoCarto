/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */


import { AppModule } from "../app.module";
declare let App : AppModule;

export class FilterModule
{
	productFilters = [];
	typeFilters = [];	
	dayFilters = [];	
	showOnlyFavorite_ = false;

	constructor() {}

	showOnlyFavorite(data)
	{
		this.showOnlyFavorite_ = data;
	};

	addFilter(data, filterType, updateElementToDisplay) 
	{	
		let listToFilter = this.getFilterListFromType(filterType);

		let index = listToFilter.indexOf(data);
		if ( index < 0) listToFilter.push(data);

		if (updateElementToDisplay) App.elementModule.updateElementToDisplay(false);
	};

	removeFilter (data, filterType, updateElementToDisplay) 
	{	
		let listToFilter = this.getFilterListFromType(filterType);

		let index = listToFilter.indexOf(data);
		if ( index > -1) 
		{
			listToFilter.splice(index, 1);
			if (updateElementToDisplay) App.elementModule.updateElementToDisplay(true);
		}
	};

	getFilterListFromType(type)
	{
		let listToFilter = null;

		switch (type)
		{
			case 'type': listToFilter = this.typeFilters; break;
			case 'product': listToFilter = this.productFilters; break;
			case 'day': listToFilter = this.dayFilters; break;
		}

		return listToFilter;
	};

	checkIfElementPassFilters (element) 
	{	
		// FAVORITE FILTER
		if (this.showOnlyFavorite_ && !element.isFavorite) return false;

		// TYPE FILTER
		let i;
		for (i = 0; i < this.typeFilters.length; i++) 
		{
			if (element.type == this.typeFilters[i]) return false;
		}

		// PRODUCTS FILTER
		let atLeastOneProductPassFilter = false;

		// si epicerie on ne fait irne
		if (element.type == 'epicerie') 
		{
			atLeastOneProductPassFilter = true;
		}
		else
		{
			let products = element.products;
			
			let updateElementIcon = false;
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

			if (updateElementIcon && atLeastOneProductPassFilter) element.marker.updateIcon();
		}

		if (!atLeastOneProductPassFilter) return false;
		

		// OPENNING HOURS FILTER
		if (this.dayFilters.length > 0)
		{
			let horaires = element.horaires;
			let day, atLeastOneDayPassFilter = false;
			for(let key in horaires)
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

	containsProduct (productName) 
	{		
		for (let i = 0; i < this.productFilters.length; i++) 
		{
			if (this.productFilters[i] == productName)
			{
				return true;
			} 
		}
		return false;
	};

	containsOpeningDay (day) 
	{		
		for (let i = 0; i < this.dayFilters.length; i++) 
		{
			if (this.dayFilters[i] == day)
			{
				return true;
			} 
		}
		return false;
	};
}