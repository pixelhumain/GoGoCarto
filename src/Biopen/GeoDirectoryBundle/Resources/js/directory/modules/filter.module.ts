/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */


import { AppModule, AppStates, AppModes } from "../app.module";
import { slugify, capitalize, parseArrayNumberIntoString, parseStringIntoArrayNumber } from "../../commons/commons";
declare let App : AppModule;

export class FilterModule
{
	productFilters = [];
	typeFilters = [];	
	dayFilters = [];	
	showOnlyFavorite_ = false;

	checkedOptionsIds = [];
	uncheckedOptionsIds = [];

	isInitialized : boolean = false;

	constructor() 
	{		
		
	}

	initialize()
	{
		let mainCategory = App.categoryModule.mainCategory;

		this.checkedOptionsIds['all'] = [];
		this.uncheckedOptionsIds['all'] = [];

		this.checkedOptionsIds['all'][mainCategory.id] = [];
		this.uncheckedOptionsIds['all'][mainCategory.id] = [];

		for(let mainOption of mainCategory.options)
		{
			this.checkedOptionsIds['all'][mainCategory.id].push(mainOption.id);			

			this.checkedOptionsIds[mainOption.id] = [];
			this.uncheckedOptionsIds[mainOption.id] = [];

			for(let category of mainOption.subcategories)
			{
				this.checkedOptionsIds[mainOption.id][category.id] = [];
				this.uncheckedOptionsIds[mainOption.id][category.id] = [];

				for(let option of category.options)
				{
					this.checkedOptionsIds[mainOption.id][category.id].push(option.id);
				}
			}
		}

		this.isInitialized = true;
	}

	showOnlyFavorite(data)
	{
		this.showOnlyFavorite_ = data;
	};

	updateFilter(optionId : number, checked : boolean)
	{
		let option = App.categoryModule.getOptionById(optionId);

		if(!option) { console.log("OptionId doesn't exist"); return; }		

		let categoryId = option.categoryOwnerId;
		let mainId = App.directoryMenuComponent.currentActiveMainOptionId;

		let checkedArray = this.checkedOptionsIds[mainId][categoryId];
		let uncheckedArray = this.uncheckedOptionsIds[mainId][categoryId];

		if (checked)
		{
			let index = checkedArray.indexOf(option.id);
			if ( index == -1) checkedArray.push(option.id);

			index = uncheckedArray.indexOf(option.id);
			if ( index > -1) uncheckedArray.splice(index, 1);
		}
		else
		{
			let index = checkedArray.indexOf(option.id);
			if ( index > -1) checkedArray.splice(index, 1);

			index = uncheckedArray.indexOf(option.id);
			if ( index == -1) uncheckedArray.push(option.id);

		}
	}

	// addFilter(data, filterType, updateElementToDisplay) 
	// {	
	// 	let listToFilter = this.getFilterListFromType(filterType);

	// 	if (listToFilter == null)
	// 	{
	// 		console.log("AddFilter not existing filtertype", filterType );
	// 	}
	// 	let index = listToFilter.indexOf(data);
	// 	if ( index < 0) listToFilter.push(data);

	// 	if (updateElementToDisplay) App.elementModule.updateElementToDisplay(false);
	// };

	// removeFilter (data, filterType, updateElementToDisplay) 
	// {	
	// 	let listToFilter = this.getFilterListFromType(filterType);

	// 	let index = listToFilter.indexOf(data);
	// 	if ( index > -1) 
	// 	{
	// 		listToFilter.splice(index, 1);
	// 		if (updateElementToDisplay) App.elementModule.updateElementToDisplay(true);
	// 	}
	// };

	// getFilterListFromType(type)
	// {
	// 	let listToFilter = null;

	// 	switch (type)
	// 	{
	// 		case 'type': listToFilter = this.typeFilters; break;
	// 		case 'product': listToFilter = this.productFilters; break;
	// 		case 'day': listToFilter = this.dayFilters; break;
	// 	}

	// 	return listToFilter;
	// };

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
				// if this element's product is not in the black filter product list
				if (!this.containsProduct(products[i].nameFormate)) 
				{
					atLeastOneProductPassFilter = true;

					// if product was previously disabled, we show it again enabled
					if (products[i].disabled)
					{
						products[i].disabled = false;
						if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = false;
						updateElementIcon = true;
					} 
				}
				else
				{
					// if product is unselected from directory menu, we show it "disabled"
					if (!products[i].disabled) 
					{
						products[i].disabled = true;
						if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = true;
						updateElementIcon = true;
					}
				}			
			}	

			// if one product have been enabled or disabled we update the element icon
			if (updateElementIcon 
				&& atLeastOneProductPassFilter 
				&& element.marker
				&& App.mode == AppModes.Map) element.marker.updateIcon();
		}

		if (!atLeastOneProductPassFilter) return false;
		

		// OPENNING HOURS FILTER
		if (this.dayFilters.length > 0)
		{
			let openHours = element.openHours;
			let day, atLeastOneDayPassFilter = false;
			for(let key in openHours)
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

	loadFiltersFromString(string : string)
	{
		let splited = string.split('@');
		let mainOptionSlug = splited[0];

		let mainOptionId = mainOptionSlug == 'all' ? 'all' : App.categoryModule.getMainOptionBySlug(mainOptionSlug).id;
		App.directoryMenuComponent.setMainOption(mainOptionId);		

		let filtersString : string;
		let addingMode : boolean;

		if ( splited.length == 2)
		{
			filtersString = splited[1];

			if (filtersString[0] == '!') addingMode = false;
			else addingMode = true;

			filtersString = filtersString.substring(1);
		}
		else if ( splited.length > 2)
		{
			console.error("Error spliting in loadFilterFromString");
		}

		let filters = parseStringIntoArrayNumber(filtersString);

		console.log('filters', filters);
		console.log('addingMode', addingMode);

		// if addingMode, we first put all the filter to false
		if (addingMode)
		{
			let options = mainOptionSlug == 'all' ? App.categoryModule.getMainOptions() : App.categoryModule.getMainOptionBySlug(mainOptionSlug).getSupOptions();
			for (let option of options)
			{				
				option.toggle(false, false);
			}
		}

		for(let filterId of filters)
		{
			let option = App.categoryModule.getOptionById(filterId);
			option.toggle(false, addingMode);
		}

		App.elementModule.updateElementToDisplay(true);

	}

	getFiltersToString() : string
	{
		if (!this.isInitialized) return;

		let mainOptionId = App.directoryMenuComponent.currentActiveMainOptionId;

		let mainOptionName;
		if (mainOptionId == 'all')
			mainOptionName = "all";
		else
			mainOptionName = App.categoryModule.getMainOptionById(App.directoryMenuComponent.currentActiveMainOptionId).nameShort;

		let checkedIdsParsed = parseArrayNumberIntoString(this.getIdsIn(this.checkedOptionsIds[mainOptionId]));
		let uncheckedIdsParsed = parseArrayNumberIntoString(this.getIdsIn(this.uncheckedOptionsIds[mainOptionId]));

		let addingMode = (checkedIdsParsed.length < uncheckedIdsParsed.length);

		let addingSymbol = addingMode ? '+' : '!';

		let filtersString = addingMode ? checkedIdsParsed : uncheckedIdsParsed;

		if (!addingMode && filtersString == "" ) return mainOptionName;

		return mainOptionName + '@' + addingSymbol + filtersString;
	}

	private getIdsIn(categoriesIds) : number[]
	{
		let resultIds = [];
		for(let categoryId in categoriesIds)
		{
			for (let optionsId of categoriesIds[categoryId])
			{
				resultIds.push(optionsId);
			}
		}

		return resultIds;
	}


}