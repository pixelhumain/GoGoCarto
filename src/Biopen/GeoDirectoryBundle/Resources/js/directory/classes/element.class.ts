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

declare let App : AppModule;
declare var $;
declare let Twig : any;
declare let biopen_twigJs_elementInfo : any;

export class Element 
{	
	readonly id : number;
	readonly name : string;
	readonly position : L.LatLng;
	readonly address : string;
	readonly description : string;
	readonly tel : string;
	readonly webSite : string;
	readonly mail : string;
	readonly products : any[] = [];

	//TODO
	mainProduct : any;
	mainProductIsDisabled : boolean;
	type : any;	

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
		this.position = L.latLng(elementJson.latitude, elementJson.longitude);
		this.address = elementJson.adresse;
		this.description = elementJson.description;
		this.tel = elementJson.tel ? elementJson.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
		this.webSite = elementJson.web_site;
		this.mail = elementJson.mail;

		this.products = [];
		let product;
		if (elementJson.type == 'epicerie') 
		{
			product = [];

			product.name = 'Epicerie';
			product.nameShort = 'Epicerie';
			product.nameFormate = 'epicerie';

			this.products.push(product);
		}
		else
		{
			for (let i = 0; i < elementJson.products.length; i++) 
			{
				product = [];

				product.name = elementJson.products[i].product.name;
				product.nameShort = elementJson.products[i].product.name_short;
				product.nameFormate = elementJson.products[i].product.name_formate;
				product.descriptif = elementJson.products[i].descriptif;
				product.disabled = false;

				this.products.push(product);
			}
		}

		this.mainProduct = elementJson.main_product;
		this.mainProductIsDisabled = false;
		this.type = elementJson.type;	

		this.distance = elementJson.distance ? Math.round(elementJson.distance) : null;
	}

initialize() 
{		
	if (!this.isInitialized_) 
	{
		this.biopenMarker_ = new BiopenMarker(this.id, this.position);
		this.isInitialized_ = true;
	}		
}

show() 
{		
	if (!this.isInitialized_) this.initialize();	
	//this.biopenMarker_.updateIcon();
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



updateProductsRepresentation() 
{		
	if (App.state !== AppStates.Constellation) return;

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

	let html = Twig.render(biopen_twigJs_elementInfo, 
	{
		element : this, 
		showDistance: App.geocoder.getLocation() ? true : false,
		listingMode: App.mode == AppModes.List, 
		productsToDisplay: this.getProductsNameToDisplay(), 
		starNames : starNames
	});
	
	this.htmlRepresentation_ = html;				
	return html;
};

getProductsNameToDisplay()
{
	this.updateProductsRepresentation();

	this.productsToDisplay_.main = [];
	this.productsToDisplay_.others = [];
	let productName;

	if (!this.mainProductIsDisabled || !this.isProducteurOrAmap())
	{
		this.productsToDisplay_.main.value = this.mainProduct;				
		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;		
	}		

	let productIsDisabled;
	for(let i = 0; i < this.products.length;i++)
	{
		productName = this.products[i].nameFormate;
		productIsDisabled = this.products[i].disabled;
		if (productName != this.productsToDisplay_.main.value)
		{
			// si le main product est disabled, on choppe le premier produit
			// non disable et on le met en produit principal
			if (!productIsDisabled && !this.productsToDisplay_.main.value)
			{
				this.productsToDisplay_.main.value = productName;				
				this.productsToDisplay_.main.disabled = productIsDisabled;				
			}
			else
			{
				this.pushToProductToDisplay(productName, productIsDisabled);
			}				
		}			
	}

	// si on a tjrs pas de mainProduct (ils sont tous disabled)
	if (!this.productsToDisplay_.main.value)	
	{
		this.productsToDisplay_.main.value = this.mainProduct;				
		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;

		this.productsToDisplay_.others.splice(0,1);
	}	

	this.productsToDisplay_.others.sort(this.compareProductsDisabled);	

	return this.productsToDisplay_;
};

private compareProductsDisabled(a,b) 
{  
  if (a.disabled == b.disabled) return 0;
  return a.disabled ? 1 : -1;
}



pushToProductToDisplay(productName, disabled)
{
	let new_product : any = {};
	new_product.value = productName;
	new_product.disabled = disabled;
	this.productsToDisplay_.others.push(new_product);
};

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

isProducteurOrAmap() 
{		
	return ($.inArray( this.type, [ "producteur", "amap" ] ) > -1);
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

