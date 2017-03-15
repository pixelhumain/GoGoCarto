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
import { Option} from "../classes/option.class";
import { Category } from "../classes/category.class";
import { Element } from "../classes/element.class";
import { CategoryOptionTreeNode } from "../classes/category-option-tree-node.class";

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

		this.checkedOptionsIds['openhours'] = [];
		this.uncheckedOptionsIds['openhours'] = [];

		for(let option of App.categoryModule.getMainOptions())
		{
			this.checkedOptionsIds[option.id] = [];
			this.uncheckedOptionsIds[option.id] = [];
		}

		//console.log(this.checkedOptionsIds);

		for(let option of App.categoryModule.options)
		{
			this.checkedOptionsIds[option.mainOwnerId].push(option.id);
		}

		this.isInitialized = true;
	}

	showOnlyFavorite(data)
	{
		this.showOnlyFavorite_ = data;
	};

	updateFilter(option : CategoryOptionTreeNode, checked : boolean)
	{
		let mainId = option.mainOwnerId;

		let checkedArray = this.checkedOptionsIds[mainId];
		let uncheckedArray = this.uncheckedOptionsIds[mainId];

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

		//console.log("Adding option filter id = " + option.id, this.uncheckedOptionsIds[mainId]);
	}

	checkIfElementPassFilters (element : Element) : boolean
	{
		return true;
	}


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

		//console.log('filters', filters);
		//console.log('addingMode', addingMode);

		// if addingMode, we first put all the filter to false
		if (addingMode)
		{
			if (mainOptionSlug == 'all')
				App.categoryModule.mainCategory.toggle(false, false);
			else
			{
				for (let cat of App.categoryModule.getMainOptionBySlug(mainOptionSlug).subcategories)
					for(let option of cat.options) option.toggle(false, false);
			}

			App.categoryModule.openHoursCategory.toggle(false, false);
		}

		for(let filterId of filters)
		{
			let option = App.categoryModule.getOptionById(filterId);
			if (!option) console.log("Error loadings filters : " + filterId);
			else option.toggle(addingMode, false);
		}

		App.elementModule.updateElementToDisplay(true);
		App.historyModule.updateCurrState();

	}

	getFiltersToString() : string
	{
		if (!this.isInitialized) return;

		let mainOptionId = App.directoryMenuComponent.currentActiveMainOptionId;

		let mainOptionName;
		let checkArrayToParse, uncheckArrayToParse;
		if (mainOptionId == 'all')
		{			
			mainOptionName = "all";
			checkArrayToParse = this.checkedOptionsIds['all'];
			uncheckArrayToParse = this.uncheckedOptionsIds['all'];
		}
		else
		{
			let mainOption = App.categoryModule.getMainOptionById(mainOptionId);
			mainOptionName = mainOption.nameShort;

			checkArrayToParse = this.checkedOptionsIds[mainOptionId];
			uncheckArrayToParse = this.uncheckedOptionsIds[mainOptionId];

			if (mainOption.showOpenHours) 
			{
				checkArrayToParse = checkArrayToParse.concat(this.checkedOptionsIds['openhours']);
				uncheckArrayToParse = uncheckArrayToParse.concat(this.uncheckedOptionsIds['openhours']);
			}
		}

		let checkedIdsParsed = parseArrayNumberIntoString(checkArrayToParse);
		let uncheckedIdsParsed = parseArrayNumberIntoString(uncheckArrayToParse);

		let addingMode = (checkedIdsParsed.length < uncheckedIdsParsed.length);

		let addingSymbol = addingMode ? '+' : '!';

		let filtersString = addingMode ? checkedIdsParsed : uncheckedIdsParsed;

		if (!addingMode && filtersString == "" ) return mainOptionName;

		return mainOptionName + '@' + addingSymbol + filtersString;
	}




	// checkIfElementPassFiltersOld (element) 
	// {	
	// 	// FAVORITE FILTER
	// 	if (this.showOnlyFavorite_ && !element.isFavorite) return false;

	// 	// TYPE FILTER
	// 	let i;
	// 	for (i = 0; i < this.typeFilters.length; i++) 
	// 	{
	// 		if (element.type == this.typeFilters[i]) return false;
	// 	}

	// 	// PRODUCTS FILTER
	// 	let atLeastOneProductPassFilter = false;

	// 	// si epicerie on ne fait irne
	// 	if (element.type == 'epicerie') 
	// 	{
	// 		atLeastOneProductPassFilter = true;
	// 	}
	// 	else
	// 	{
	// 		let products = element.products;
			
	// 		let updateElementIcon = false;
	// 		for (i = 0; i < products.length; i++) 
	// 		{
	// 			// if this element's product is not in the black filter product list
	// 			if (!this.containsProduct(products[i].nameFormate)) 
	// 			{
	// 				atLeastOneProductPassFilter = true;

	// 				// if product was previously disabled, we show it again enabled
	// 				if (products[i].disabled)
	// 				{
	// 					products[i].disabled = false;
	// 					if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = false;
	// 					updateElementIcon = true;
	// 				} 
	// 			}
	// 			else
	// 			{
	// 				// if product is unselected from directory menu, we show it "disabled"
	// 				if (!products[i].disabled) 
	// 				{
	// 					products[i].disabled = true;
	// 					if (products[i].nameFormate == element.mainProduct) element.mainProductIsDisabled = true;
	// 					updateElementIcon = true;
	// 				}
	// 			}			
	// 		}	

	// 		// if one product have been enabled or disabled we update the element icon
	// 		if (updateElementIcon 
	// 			&& atLeastOneProductPassFilter 
	// 			&& element.marker
	// 			&& App.mode == AppModes.Map) element.marker.updateIcon();
	// 	}

	// 	if (!atLeastOneProductPassFilter) return false;
		

	// 	// OPENNING HOURS FILTER
	// 	if (this.dayFilters.length > 0)
	// 	{
	// 		let openHours = element.openHours;
	// 		let day, atLeastOneDayPassFilter = false;
	// 		for(let key in openHours)
	// 		{
	// 			day = key.split('_')[1];
	// 			if ( !this.containsOpeningDay(day) )
	// 			{
	// 				atLeastOneDayPassFilter = true;
	// 			}
	// 		}

	// 		return atLeastOneDayPassFilter;
	// 	}
	// 	return true;
	// };

	// containsProduct (productName) 
	// {		
	// 	for (let i = 0; i < this.productFilters.length; i++) 
	// 	{
	// 		if (this.productFilters[i] == productName)
	// 		{
	// 			return true;
	// 		} 
	// 	}
	// 	return false;
	// };

	// containsOpeningDay (day) 
	// {		
	// 	for (let i = 0; i < this.dayFilters.length; i++) 
	// 	{
	// 		if (this.dayFilters[i] == day)
	// 		{
	// 			return true;
	// 		} 
	// 	}
	// 	return false;
	// };
}