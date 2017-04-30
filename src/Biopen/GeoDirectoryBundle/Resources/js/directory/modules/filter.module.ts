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
	showOnlyFavorite_ : boolean = false;
	showPending_ : boolean = true;

	constructor() {	}

	showOnlyFavorite(bool : boolean)
	{
		this.showOnlyFavorite_ = bool;
	};

	showPending(bool : boolean)
	{
		this.showPending_ = bool;
	};

	checkIfElementPassFilters (element : Element) : boolean
	{
		if (this.showOnlyFavorite_) return element.isFavorite;

		if(!this.showPending_ && element.isPending()) return false;

		if (App.currMainId == 'all')
		{
			let elementOptions = element.getOptionValueByCategoryId( App.categoryModule.mainCategory.id);
			let checkedOptions = App.categoryModule.mainCategory.checkedOptions;

			//console.log("\nelementsOptions", elementOptions.map( (value) => value.option.name));
			//console.log("checkedOptions", checkedOptions.map( (value) => value.name));

			let result = elementOptions.some(optionValue => checkedOptions.indexOf(optionValue.option) > -1);
			//console.log("return", result);
			return result ;
		}
		else
		{
			let mainOption = App.categoryModule.getCurrMainOption();			
			let isPassingFilters = this.recursivelyCheckedInOption(mainOption, element);
			
			if (isPassingFilters && element.openHours)
			{
				isPassingFilters = element.openHoursDays.some( (day : any) => App.categoryModule.openHoursFiltersDays.indexOf(day) > -1);
			}

			return isPassingFilters;
		}		
	}

	private recursivelyCheckedInOption(option : Option, element : Element) : boolean
	{
		let ecart = "";
		for(let i = 0; i < option.depth; i++) ecart+= "--";

		let log = false;

		if (log) console.log(ecart + "Check for option ", option.name);

		let result;
		if (option.subcategories.length == 0 || (option.isDisabled && !option.isMainOption) )
		{
			if (log) console.log(ecart + "No subcategories ");
			result = option.isChecked;
		}
		else
		{
			result = option.subcategories.every( (category) =>
			{
				if (log) console.log("--" + ecart + "Category", category.name);

				let checkedOptions = category.checkedOptions;
				let elementOptions = element.getOptionValueByCategoryId(category.id);

				let isSomeOptionInCategoryCheckedOptions = elementOptions.some(optionValue => checkedOptions.indexOf(optionValue.option) > -1); 

				if (log) console.log("--" + ecart + "isSomeOptionInCategoryCheckedOptions", isSomeOptionInCategoryCheckedOptions);
				if (isSomeOptionInCategoryCheckedOptions)
					return true;
				else
				{				
					if (log) console.log("--" + ecart + "So we checked in suboptions", category.name);
					return elementOptions.some( (optionValue) => this.recursivelyCheckedInOption(optionValue.option, element));
				}
			});
		}
		if (log) console.log(ecart + "Return ", result);
		return result;
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

		if (mainOptionSlug == 'all') App.categoryModule.mainCategory.updateState();
		else App.categoryModule.getMainOptionBySlug(mainOptionSlug).recursivelyUpdateStates();

		App.elementModule.updateElementsToDisplay(true);
		//App.historyModule.updateCurrState();

	}

	getFiltersToString() : string
	{
		let mainOptionId = App.currMainId;

		let mainOptionName;
		let checkArrayToParse, uncheckArrayToParse;
		
		if (mainOptionId == 'all')
		{			
			mainOptionName = "all";
			checkArrayToParse = App.categoryModule.mainCategory.checkedOptions.map( (option) => option.id);
			uncheckArrayToParse = App.categoryModule.mainCategory.disabledOptions.map( (option) => option.id);
		}
		else
		{
			let mainOption = App.categoryModule.getMainOptionById(mainOptionId);
			mainOptionName = mainOption.nameShort;

			let allOptions = mainOption.allChildrenOptions;

			checkArrayToParse = allOptions.filter( (option) => option.isChecked ).map( (option) => option.id);
			uncheckArrayToParse = allOptions.filter( (option) => option.isDisabled ).map( (option) => option.id);

			if (mainOption.showOpenHours) 
			{
				checkArrayToParse = checkArrayToParse.concat(App.categoryModule.openHoursCategory.checkedOptions.map( (option) => option.id));
				uncheckArrayToParse = uncheckArrayToParse.concat(App.categoryModule.openHoursCategory.disabledOptions.map( (option) => option.id));
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
}