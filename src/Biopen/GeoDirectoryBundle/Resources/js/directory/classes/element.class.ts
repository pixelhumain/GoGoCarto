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
import { Option } from "./option.class";
import { Category } from "./category.class";
import { OptionValue, CategoryValue } from "./option-value.class";

declare let App : AppModule;
declare var $;
declare let Twig : any;
declare let biopen_twigJs_elementInfo : any;



export class Element 
{	
	readonly id : string;
	readonly name : string;
	readonly position : L.LatLng;
	readonly address : string;
	readonly description : string;
	readonly tel : string;
	readonly webSite : string;
	readonly mail : string;
	readonly mainOptionOwnerIds : number[] = [];

	optionsValues : OptionValue[] = [];
	optionValuesByCatgeory : OptionValue[][] = [];

	colorOptionId : number;
	iconsToDisplay : Option[] = [];
	optionTree : OptionValue;

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

	constructor(elementJson : any)
	{
		this.id = elementJson.id;
		this.name = elementJson.name;
		this.position = L.latLng(elementJson.lat, elementJson.lng);
		this.address = elementJson.address;
		this.description = elementJson.description;
		this.tel = elementJson.tel ? elementJson.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
		this.webSite = elementJson.web_site;
		this.mail = elementJson.mail;

		let newOption : OptionValue, ownerId : number;
		for (let optionValueJson of elementJson.option_values)
		{
			newOption = new OptionValue(optionValueJson);

			//ownerId = newOption.option.mainOwnerId;
			if (newOption.option.isMainOption()) this.mainOptionOwnerIds.push(newOption.optionId);
			//if (this.mainOptionOwnerIds.indexOf(ownerId) == -1) 

			this.optionsValues.push(newOption);

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
		if (!this.isInitialized_) 
		{
			this.createOptionsTree();
			this.updateColorOptionId();
			this.updateIconsToDisplay();

			this.biopenMarker_ = new BiopenMarker(this.id, this.position);
			this.isInitialized_ = true;
		}		
	}

	show() 
	{		
		if (!this.isInitialized_) this.initialize();	
		//this.biopenMarker_.update();
		this.biopenMarker_.show();
		this.isVisible_ = true;		
	};

	hide() 
	{		
		if (this.biopenMarker_) this.biopenMarker_.hide();
		this.isVisible_ = false;
		// unbound events (click etc...)?
		//if (constellationMode) $('#directory-content-list #element-info-'+this.id).hide();
	};

	update()
	{
		this.updateColorOptionId();
		this.updateIconsToDisplay();
		this.marker.update();
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

	updateColorOptionId() 
	{
		if (App.currMainId == 'all')
			this.colorOptionId = this.recursivelySearchForColorOptionId(this.optionTree, false);
		else
			this.colorOptionId = this.recursivelySearchForColorOptionId(this.getCurrMainOptionValue());
	}

	private recursivelySearchForColorOptionId(parentOptionValue : OptionValue, recursive : boolean = true) : number
	{
		if (!parentOptionValue) return null;

		for(let categoryValue of parentOptionValue.children)
		{
			for(let optionValue of categoryValue.children)
			{
				if (optionValue.option.isChecked && optionValue.option.useColorForMarker)
					return optionValue.optionId;
				else if (recursive)
				{
					let result = this.recursivelySearchForColorOptionId(optionValue);
					if (result != null) return result;
				}
			}
		}
		return null;
	}

	updateIconsToDisplay()
	{
		
		if (App.currMainId == 'all')
			this.iconsToDisplay = this.recursivelyCreateIconsToDisplay(this.optionTree, false);
		else
			this.iconsToDisplay = this.recursivelyCreateIconsToDisplay(this.getCurrMainOptionValue());

		this.iconsToDisplay.sort( (a,b) => a.isDisabled ? 1 : -1);
	}

	private recursivelyCreateIconsToDisplay(parentOptionValue : OptionValue, recursive : boolean = true) : Option[]
	{
		if (!parentOptionValue) return null;

		let resultOptions : Option[] = [];

		for(let categoryValue of parentOptionValue.children)
		{
			for(let optionValue of categoryValue.children)
			{
				if (optionValue.option.useIconForMarker)
				{
					resultOptions.push(optionValue.option);
				}
				else if (recursive)
				{
					let result = this.recursivelyCreateIconsToDisplay(optionValue);
					if (result != null) resultOptions = resultOptions.concat(result);
				}
			}
		}
		return resultOptions;
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

	getHtmlRepresentation() 
	{	
		//let starNames = App.state == AppStates.Constellation ? App.constellation.getStarNamesRepresentedByElementId(this.id) : [];
		let starNames : any[] = [];

		let optionstoDisplay = this.iconsToDisplay;

		let html = Twig.render(biopen_twigJs_elementInfo, 
		{
			element : this, 
			showDistance: App.geocoder.getLocation() ? true : false,
			listingMode: App.mode == AppModes.List, 
			optionsToDisplay: optionstoDisplay,
			mainOptionToDisplay: optionstoDisplay[0], 
			otherOptionsToDisplay: optionstoDisplay.slice(1),  
			starNames : starNames
		});

		//console.log("Element options", this.getOptionsList().map( (option) => option.name));
		//console.log("Element options", this.getOptionsList());
		
		this.htmlRepresentation_ = html;				
		return html;
	};

	getOptionsList() : Option[]
	{
		let currMainId = App.currMainId;

		let optionListTree = [];

		this.optionsValues.filter( (optionValue) => optionValue.option.isMainOption());



		let sorted = this.optionsValues.sort( (a ,b) => 
		{
			if (a.option.isDisabled == b.option.isDisabled)
			{
				return a.option.depth - b.option.depth || a.index - b.index;				
			}
			else return a.option.isDisabled ? 1 : -1;
			
		}).map( (optionValue) => 
		{
			let option : any = optionValue.option;
			// add description attribute
			option.description = optionValue.description || '';
			return option;
		});

		//console.log("getOptionstoDisplay", sorted);

		return sorted;
	}

	// getProductsNameToDisplay()
	// {

	// 	this.updateProductsRepresentation();



	// 	this.productsToDisplay_.main = [];
	// 	this.productsToDisplay_.others = [];
	// 	let productName;

	// 	if (!this.mainProductIsDisabled || !this.isProducteurOrAmap())
	// 	{
	// 		this.productsToDisplay_.main.value = this.mainProduct;				
	// 		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;		
	// 	}		

	// 	let productIsDisabled;
	// 	for(let i = 0; i < this.products.length;i++)
	// 	{
	// 		productName = this.products[i].nameFormate;
	// 		productIsDisabled = this.products[i].disabled;
	// 		if (productName != this.productsToDisplay_.main.value)
	// 		{
	// 			// si le main product est disabled, on choppe le premier produit
	// 			// non disable et on le met en produit principal
	// 			if (!productIsDisabled && !this.productsToDisplay_.main.value)
	// 			{
	// 				this.productsToDisplay_.main.value = productName;				
	// 				this.productsToDisplay_.main.disabled = productIsDisabled;				
	// 			}
	// 			else
	// 			{
	// 				this.pushToProductToDisplay(productName, productIsDisabled);
	// 			}				
	// 		}			
	// 	}

	// 	// si on a tjrs pas de mainProduct (ils sont tous disabled)
	// 	if (!this.productsToDisplay_.main.value)	
	// 	{
	// 		this.productsToDisplay_.main.value = this.mainProduct;				
	// 		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;

	// 		this.productsToDisplay_.others.splice(0,1);
	// 	}	

	// 	this.productsToDisplay_.others.sort(this.compareProductsDisabled);	

	// 	return this.productsToDisplay_;
	// };

	// private compareProductsDisabled(a,b) 
	// {  
	//   if (a.disabled == b.disabled) return 0;
	//   return a.disabled ? 1 : -1;
	// }



	// pushToProductToDisplay(productName, disabled)
	// {
	// 	let new_product : any = {};
	// 	new_product.value = productName;
	// 	new_product.disabled = disabled;
	// 	this.productsToDisplay_.others.push(new_product);
	// };

	// getFormatedOpenHourss() 
	// {		
	// 	if (this.formatedOpenHours_ === null )
	// 	{		
	// 		this.formatedOpenHours_ = {};
	// 		let new_key;
	// 		for(let key in this.openHours)
	// 		{
	// 			new_key = key.split('_')[1];
	// 			this.formatedOpenHours_[new_key] = this.formateDailyTimeSlot(this.openHours[key]);
	// 		}
	// 	}
	// 	return this.formatedOpenHours_;
	// };

	formateDailyTimeSlot(dailySlot) 
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

