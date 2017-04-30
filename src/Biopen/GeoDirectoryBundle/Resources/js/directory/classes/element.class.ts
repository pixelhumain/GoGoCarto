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
import { BiopenMarker } from "../components/map/biopen-marker.component";
import { OptionValue, CategoryValue, Option, Category } from "./classes";

declare let App : AppModule;
declare var $;
declare let Twig : any;
declare let biopen_twigJs_elementInfo : any;


export enum ElementStatus 
{
	Deleted = -2,
  ModerationNeeded = -1,
  Pending = 0,
  AdminValidate = 1,
  CollaborativeValidate = 1
}

export class Element 
{	
	readonly id : string;
	readonly status : ElementStatus;
	readonly name : string;
	readonly position : L.LatLng;
	readonly address : string;
	readonly description : string;
	readonly tel : string;
	readonly webSite : string;
	readonly mail : string;
	readonly openHours : any;
	readonly openHoursDays : string[] = [];
	readonly openHoursMoreInfos : any;
	readonly mainOptionOwnerIds : number[] = [];

	optionsValues : OptionValue[] = [];
	optionValuesByCatgeory : OptionValue[][] = [];

	colorOptionId : number;
	private iconsToDisplay : OptionValue[] = [];
	private optionTree : OptionValue;

	formatedOpenHours_ = null;

	distance : number;

	isInitialized_ :boolean = false;

	// for elements module algorithms
	isDisplayed :boolean = false;

	isVisible_ : boolean = false;
	isInElementList : boolean= false;

	//TODO
	biopenMarker_ : BiopenMarker = null;
	htmlRepresentation_ = '';

	productsToDisplay_ : any = {};

	starChoiceForRepresentation = '';
	isShownAlone : boolean= false;

	isFavorite : boolean= false;

	needToBeUpdatedWhenShown : boolean = true;

	constructor(elementJson : any)
	{
		this.id = elementJson.id;
		this.status = elementJson.status;
		this.name = elementJson.name;
		this.position = L.latLng(elementJson.coordinates.lat, elementJson.coordinates.lng);
		this.address = elementJson.address;
		this.description = elementJson.description || '';
		this.tel = elementJson.tel ? elementJson.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
		this.webSite = elementJson.webSite;
		this.mail = elementJson.mail;
		this.openHours = elementJson.openHours;
		this.openHoursMoreInfos =  elementJson.openHoursMoreInfos;

		// initialize formated open hours
		this.getFormatedOpenHours();

		let newOption : OptionValue, ownerId : number;
		for (let optionValueJson of elementJson.optionValues)
		{
			newOption = new OptionValue(optionValueJson);

			//ownerId = newOption.option.mainOwnerId;
			if (newOption.option.isMainOption()) this.mainOptionOwnerIds.push(newOption.optionId);
			//if (this.mainOptionOwnerIds.indexOf(ownerId) == -1) 

			this.optionsValues.push(newOption);

			// put options value in specific easy accessible array for better performance
			if (!this.optionValuesByCatgeory[newOption.option.ownerId]) this.optionValuesByCatgeory[newOption.option.ownerId] = [];
			this.optionValuesByCatgeory[newOption.option.ownerId].push(newOption);
		}

		this.distance = elementJson.distance ? Math.round(elementJson.distance) : null;	

	}	

	getOptionValueByCategoryId($categoryId)
	{
		return this.optionValuesByCatgeory[$categoryId] || [];
	}	

	initialize() 
	{		
		this.createOptionsTree();
		this.updateIconsToDisplay();

		this.biopenMarker_ = new BiopenMarker(this.id, this.position);
		this.isInitialized_ = true;	
	}

	show() 
	{		
		if (!this.isInitialized_) this.initialize();	
		//this.update();
		//this.biopenMarker_.update();
		this.biopenMarker_.show();
		this.isVisible_ = true;		
	};

	hide() 
	{		
		if (this.biopenMarker_ && App.mode == AppModes.Map) this.biopenMarker_.hide();
		this.isVisible_ = false;
		// unbound events (click etc...)?
		//if (constellationMode) $('#directory-content-list #element-info-'+this.id).hide();
	};

	update($force : boolean = false)
	{
		//console.log("marker update needToBeUpdated", this.needToBeUpdatedWhenShown);
		if (this.needToBeUpdatedWhenShown || App.mode == AppModes.List || $force)
		{
			this.updateIconsToDisplay();

			let optionValuesToUpdate = this.getCurrOptionsValues().filter( (optionValue) => optionValue.isFilledByFilters);
			optionValuesToUpdate.push(this.getCurrMainOptionValue());
			for(let optionValue of optionValuesToUpdate) this.updateOwnerColor(optionValue);

			this.colorOptionId = this.iconsToDisplay.length > 0 && this.getIconsToDisplay()[0] ? this.getIconsToDisplay()[0].colorOptionId : null;	

			if (this.marker) this.marker.update();
			this.needToBeUpdatedWhenShown = false;
		}		
	}

	updateOwnerColor($optionValue : OptionValue)
	{
		if (!$optionValue) return;
		//console.log("updateOwnerColor", $optionValue.option.name);
		if ($optionValue.option.useColorForMarker)
		{
			$optionValue.colorOptionId = $optionValue.optionId;
		}		
		else 
		{
			let option : Option;
			let category : Category;
			let colorId : number = null;

			let siblingsOptionsForColoring : OptionValue[] = this.getCurrOptionsValues().filter( 
				(optionValue) => 
					optionValue.isFilledByFilters 
					&& optionValue.option.useColorForMarker
					&& optionValue.option.ownerId !== $optionValue.option.ownerId 
					&& optionValue.categoryOwner.ownerId == $optionValue.categoryOwner.ownerId
			);

			//console.log("siblingsOptionsForColoring", siblingsOptionsForColoring.map( (op) => op.option.name));
			if (siblingsOptionsForColoring.length > 0)
			{
				option = <Option> siblingsOptionsForColoring.shift().option;
				//console.log("-> sibling found : ", option.name);
				colorId = option.id;
			}
			else
			{
				option = $optionValue.option;
				//console.log("no siblings, looking for parent");
				while(colorId == null && option)
				{
					category = <Category> option.getOwner();
					if (category)
					{
						option = <Option> category.getOwner();					
						//console.log("->parent option" + option.name + " usecolorForMarker", option.useColorForMarker);
						colorId = option.useColorForMarker ? option.id : null;
					}					
				}
			}
			
			$optionValue.colorOptionId = colorId;
		}
	}

	getCurrOptionsValues() : OptionValue[]
	{
		return this.optionsValues.filter( (optionValue) => optionValue.option.mainOwnerId == App.currMainId);
	}

	getCurrMainOptionValue() : OptionValue
	{
		return this.optionsValues.filter( (optionValue) => optionValue.option.id == App.currMainId).shift();
	}

	getCategoriesIds() : number[]
	{
		return this.getCurrOptionsValues().map( (optionValue) => optionValue.categoryOwner.id).filter((value, index, self) => self.indexOf(value) === index);
	}

	getOptionsIdsInCategorieId(categoryId) : number[]
	{
		return this.getCurrOptionsValues().filter( (optionValue) => optionValue.option.ownerId == categoryId).map( (optionValue) => optionValue.optionId);
	}

	createOptionsTree()
	{
		this.optionTree = new OptionValue({});
		let mainCategory = App.categoryModule.mainCategory;

		this.recusivelyCreateOptionTree(mainCategory, this.optionTree);
	}

	getOptionTree()
	{
		if (this.optionTree) return this.optionTree;
		this.createOptionsTree();
		return this.optionTree;
	}

	private recusivelyCreateOptionTree(category : Category, optionValue : OptionValue)
	{
		let categoryValue = new CategoryValue(category);

		for(let option of category.options)
		{
			let childOptionValue = this.fillOptionId(option.id);
			if (childOptionValue)
			{
				categoryValue.addOptionValue(childOptionValue);
				for(let subcategory of option.subcategories)
				{
					this.recusivelyCreateOptionTree(subcategory, childOptionValue);
				}
			}			
		}

		if (categoryValue.children.length > 0)
		{
			categoryValue.children.sort( (a,b) => a.index - b.index);
			optionValue.addCategoryValue(categoryValue);
		} 
	}

	fillOptionId($optionId : number) : OptionValue
	{
		let index = this.optionsValues.map((value) => value.optionId).indexOf($optionId);
		if (index == -1) return null;
		return this.optionsValues[index];
	}

	getIconsToDisplay() : OptionValue[]
	{
		let result = this.iconsToDisplay;
		return result.sort( (a,b) => a.isFilledByFilters ? -1 : 1);
	}

	updateIconsToDisplay() 
	{		
		this.checkForDisabledOptionValues();

		if (App.currMainId == 'all')
			this.iconsToDisplay = this.recursivelySearchIconsToDisplay(this.getOptionTree(), false);
		else
			this.iconsToDisplay = this.recursivelySearchIconsToDisplay(this.getCurrMainOptionValue());

		// in case of no OptionValue in this mainOption, we display the mainOption Icon
		if (this.iconsToDisplay.length == 0)
		{
			this.iconsToDisplay.push(this.getCurrMainOptionValue());
		}
		
		//console.log("Icons to display sorted", this.getIconsToDisplay());
	}

	private recursivelySearchIconsToDisplay(parentOptionValue : OptionValue, recursive : boolean = true) : OptionValue[]
	{
		if (!parentOptionValue) return [];

		let resultOptions : OptionValue[] = [];		

		for(let categoryValue of parentOptionValue.children)
		{
			for(let optionValue of categoryValue.children)
			{
				let result = [];
				
				if (recursive)
				{
					result = this.recursivelySearchIconsToDisplay(optionValue) || [];
					resultOptions = resultOptions.concat(result);
				}

				if (result.length == 0 && optionValue.option.useIconForMarker)
				{
					resultOptions.push(optionValue);
				}

			}
		}
		return resultOptions;
	}

	checkForDisabledOptionValues()
	{
		this.recursivelyCheckForDisabledOptionValues(this.getOptionTree(), App.currMainId == 'all');
	}

	private recursivelyCheckForDisabledOptionValues(optionValue : OptionValue, noRecursive : boolean = true)
	{
		let isEveryCategoryContainsOneOptionNotdisabled = true;
		//console.log("checkForDisabledOptionValue Norecursive : " + noRecursive, optionValue);

		for(let categoryValue of optionValue.children)
		{
			let isSomeOptionNotdisabled = false;
			for (let suboptionValue of categoryValue.children)
			{
				if (suboptionValue.children.length == 0 || noRecursive)
				{
					//console.log("bottom option " + suboptionValue.option.name,suboptionValue.option.isChecked );
					suboptionValue.isFilledByFilters = suboptionValue.option.isChecked;					
				}
				else
				{
					this.recursivelyCheckForDisabledOptionValues(suboptionValue, noRecursive);
				}
				if (suboptionValue.isFilledByFilters) isSomeOptionNotdisabled = true;
			}
			if (!isSomeOptionNotdisabled) isEveryCategoryContainsOneOptionNotdisabled = false;
			//console.log("CategoryValue " + categoryValue.category.name + "isSomeOptionNotdisabled", isSomeOptionNotdisabled);
		}

		if (optionValue.option)
		{
			//console.log("OptionValue " + optionValue.option.name + " : isEveryCategoyrContainOnOption", isEveryCategoryContainsOneOptionNotdisabled );
			optionValue.isFilledByFilters = isEveryCategoryContainsOneOptionNotdisabled;
			if (!optionValue.isFilledByFilters) optionValue.setRecursivelyFilledByFilters(optionValue.isFilledByFilters);
		}
	}

	updateProductsRepresentation() 
	{		
		// if (App.state !== AppStates.Constellation) return;

		// let starNames = App.constellation.getStarNamesRepresentedByElementId(this.id);
		// if (this.isProducteurOrAmap())
		// {
		// 	for(let i = 0; i < this.products.length;i++)
		// 	{
		// 		productName = this.products[i].nameFormate;			

		// 		if ($.inArray(productName, starNames) == -1)
		// 		{
		// 			this.products[i].disabled = true;				
		// 			if (productName == this.mainProduct) this.mainProductIsDisabled = true;				
		// 		}	
		// 		else
		// 		{
		// 			this.products[i].disabled = false;				
		// 			if (productName == this.mainProduct) this.mainProductIsDisabled = false;		
		// 		}		
		// 	}
		// }
		// else
		// {
		// 	if (starNames.length === 0) this.mainProductIsDisabled = true;	
		// 	else this.mainProductIsDisabled = false;	
		// }
	};

	updateDistance()
	{
		this.distance = null;
		if (App.geocoder.getLocation()) 
			this.distance = App.mapComponent.distanceFromLocationTo(this.position);
		else if (App.mapComponent.getCenter())
			this.distance = App.mapComponent.getCenter().distanceTo(this.position);
		// distance vol d'oiseau, on arrondi et on l'augmente un peu
		this.distance = this.distance ? Math.round(1.2*this.distance) : null;
	}

	isPending() { return this.status === ElementStatus.Pending; }

	getHtmlRepresentation() 
	{	
		this.update();	
		//let starNames = App.state == AppStates.Constellation ? App.constellation.getStarNamesRepresentedByElementId(this.id) : [];
		let starNames : any[] = [];

		let optionstoDisplay = this.getIconsToDisplay();

		//console.log("GetHtmlRepresentation " + this.distance + " km", this.getOptionTree().children[0]);

		let html = Twig.render(biopen_twigJs_elementInfo, 
		{
			element : this, 
			showDistance: App.geocoder.getLocation() ? true : false,
			listingMode: App.mode == AppModes.List, 
			optionsToDisplay: optionstoDisplay,
			allOptionsValues: this.getCurrOptionsValues().filter( (oV) => oV.option.displayOption).sort( (a,b) => a.isFilledByFilters ? -1 : 1),
			mainOptionValueToDisplay: optionstoDisplay[0], 
			otherOptionsValuesToDisplay: optionstoDisplay.slice(1),  
			starNames : starNames,
			mainCategoryValue : this.getOptionTree().children[0],
			pendingClass : this.isPending() ? 'pending' : ''
		});

		
		this.htmlRepresentation_ = html;				
		return html;
	};

	getFormatedOpenHours() 
	{		
		if (this.formatedOpenHours_ === null )
		{		
			this.formatedOpenHours_ = {};
			let new_key, new_key_translated, newDailySlot;
			for(let key in this.openHours)
			{
				new_key = key.split('_')[1];
				new_key_translated = this.translateDayKey(new_key);				
				newDailySlot = this.formateDailyTimeSlot(this.openHours[key]);
				
				if (newDailySlot)
				{
					this.formatedOpenHours_[new_key_translated] = newDailySlot;
					this.openHoursDays.push(new_key_translated);
				}
			}
		}
		return this.formatedOpenHours_;
	};

	private translateDayKey(dayKey)
	{
		switch(dayKey)
		{
			case 'monday': return 'lundi';
			case 'tuesday': return 'mardi';
			case 'wednesday': return 'mercredi';
			case 'thursday': return 'jeudi';
			case 'friday': return 'vendredi';
			case 'saturday': return 'samedi';
			case 'sunday': return 'dimanche';
		}

		return '';
	}

	private formateDailyTimeSlot(dailySlot) 
	{		
		if (dailySlot === null)
		{		
			return 'fermé';
		}
		let result = '';
		if (dailySlot.slot1start)
		{
			result+= this.formateDate(dailySlot.slot1start);
			result+= ' - ';
			result+= this.formateDate(dailySlot.slot1end);
		}
		if (dailySlot.slot2start)
		{
			result+= ' et ';
			result+= this.formateDate(dailySlot.slot2start);
			result+= ' - ';
			result+= this.formateDate(dailySlot.slot2end);
		}
		return result;
	};

	formateDate(date) 
	{		
		if (!date) return;
		return date.split('T')[1].split(':00+0100')[0];
	};

	isCurrentStarChoiceRepresentant() 
	{		
		if ( this.starChoiceForRepresentation !== '')
		{
			let elementStarId = App.constellation.getStarFromName(this.starChoiceForRepresentation).getElementId();
			return (this.id == elementStarId);
		}
		return false;	
	};









	// --------------------------------------------
	//            SETTERS GETTERS
	// ---------------------------------------------
	get marker()  : BiopenMarker
	{		
		// initialize = initialize || false;
		// if (initialize) this.initialize();
		return this.biopenMarker_;
	};

	get isVisible() 
	{		
		return this.isVisible_;
	};

	get isInitialized() 
	{		
		return this.isInitialized_;
	};

}

