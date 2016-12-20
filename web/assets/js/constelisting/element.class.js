/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function Element(element) 
{	
	this.id = element.id;
	this.name = element.name;
	this.position = new google.maps.LatLng(element.latlng.latitude, element.latlng.longitude);
	this.adresse = element.adresse;
	this.description = element.description;
	this.tel = element.tel ? element.tel.replace(/(.{2})(?!$)/g,"$1 ") : '';	
	this.webSite = element.web_site;
	this.mail = element.mail;
	this.products = [];
	var product;
	if (element.type == 'epicerie') 
	{
		product = [];

		product.name = 'Epicerie';
		product.nameShort = 'Epicerie';
		product.nameFormate = 'epicerie';

		this.products.push(product);
	}
	else
	{
		for (var i = 0; i < element.products.length; i++) 
		{
			product = [];

			product.name = element.products[i].product.name;
			product.nameShort = element.products[i].product.name_short;
			product.nameFormate = element.products[i].product.name_formate;
			product.descriptif = element.products[i].descriptif;
			product.disabled = false;

			this.products.push(product);
		}
	}

	this.mainProduct = element.main_product;
	this.mainProductIsDisabled = false;
	this.horaires = element.horaires;
	this.type = element.type;	

	this.distance = element.distance ? Math.round(element.distance) : null;
	
	this.isInitialized_ = false;

	this.isVisible_ = false;
	this.isInElementList = false;

	this.biopenMarker_ = null;
	this.htmlRepresentation_ = '';
	this.formatedHoraire_ = null;

	this.productsToDisplay_ = [];

	this.starChoiceForRepresentation = '';
	this.isShownAlone = false;

	this.isFavorite = false;

	// TODO delete elementPhp['Element'] ?
}

Element.prototype.initialize = function () 
{		
	if (!this.isInitialized_) 
	{
		this.biopenMarker_ = new BiopenMarker(this.id, this.position);
		this.isInitialized_ = true;
	}		
};

Element.prototype.show = function () 
{		
	if (!this.isInitialized_) this.initialize();	
	this.biopenMarker_.updateIcon();
	this.biopenMarker_.show();
	this.isVisible_ = true;		
};

Element.prototype.hide = function () 
{		
	this.biopenMarker_.hide();
	this.isVisible_ = false;
	// unbound events (click etc...)?
	//if (constellationMode) $('#ElementList #element-info-'+this.id).hide();
};

Element.prototype.updateProductsRepresentation = function () 
{		
	if (!constellationMode) return;

	var starNames = App.getConstellation().getStarNamesRepresentedByElementId(this.id);
	if (this.isProducteurOrAmap())
	{
		for(i = 0; i < this.products.length;i++)
		{
			productName = this.products[i].nameFormate;			

			if ($.inArray(productName, starNames) == -1)
			{
				this.products[i].disabled = true;				
				if (productName == this.mainProduct) this.mainProductIsDisabled = true;				
			}	
			else
			{
				this.products[i].disabled = false;				
				if (productName == this.mainProduct) this.mainProductIsDisabled = false;		
			}		
		}
	}
	else
	{
		if (starNames.length === 0) this.mainProductIsDisabled = true;	
		else this.mainProductIsDisabled = false;	
	}
};

Element.prototype.getHtmlRepresentation = function () 
{	
	var starNames = constellationMode ? App.getConstellation().getStarNamesRepresentedByElementId(this.id) : [];
	var location = App.getMap().location;
	if (location)
	{
		this.distance = calculateDistanceFromLatLonInKm(location, this.position);
		// distance vol d'oiseau, on arrondi et on l'augmente un peu
		this.distance = Math.round(1.2*this.distance);
	}

	var html = Twig.render(twig-js-element-info, 
				{
					element : this, 
					horaires : this.getFormatedHoraires(), 
					constellationMode: constellationMode, 
					productsToDisplay: this.getProductsNameToDisplay(), 
					starNames : starNames 
				});
	this.htmlRepresentation_ = html;				
	return html;
};

Element.prototype.getProductsNameToDisplay = function ()
{
	this.updateProductsRepresentation();

	this.productsToDisplay_.main = [];
	this.productsToDisplay_.others = [];
	var productName;

	if (!this.mainProductIsDisabled || !this.isProducteurOrAmap())
	{
		this.productsToDisplay_.main.value = this.mainProduct;				
		this.productsToDisplay_.main.disabled = this.mainProductIsDisabled;		
	}		

	var productIsDisabled;
	for(var i = 0; i < this.products.length;i++)
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

	this.productsToDisplay_.others.sort(compareProductsDisabled);	

	return this.productsToDisplay_;
};

function compareProductsDisabled(a,b) 
{  
  if (a.disabled == b.disabled) return 0;
  return a.disabled ? 1 : -1;
}

Element.prototype.pushToProductToDisplay = function(productName, disabled)
{
	var new_product = [];
	new_product.value = productName;
	new_product.disabled = disabled;
	this.productsToDisplay_.others.push(new_product);
};

Element.prototype.getFormatedHoraires = function () 
{		
	if (this.formatedHoraire_ === null )
	{		
		this.formatedHoraire_ = {};
		var new_key;
		for(var key in this.horaires)
		{
			new_key = key.split('_')[1];
			this.formatedHoraire_[new_key] = this.formateJourHoraire(this.horaires[key]);
		}
	}
	return this.formatedHoraire_;
};

Element.prototype.formateJourHoraire = function (dayHoraire) 
{		
	if (dayHoraire === null)
	{		
		return 'fermé';
	}
	var result = '';
	if (dayHoraire.plage1debut)
	{
		result+= this.formateDate(dayHoraire.plage1debut);
		result+= ' - ';
		result+= this.formateDate(dayHoraire.plage1fin);
	}
	if (dayHoraire.plage2debut)
	{
		result+= ' et ';
		result+= this.formateDate(dayHoraire.plage2debut);
		result+= ' - ';
		result+= this.formateDate(dayHoraire.plage2fin);
	}
	return result;
};

Element.prototype.formateDate = function (date) 
{		
	if (!date) return;
	return date.split('T')[1].split(':00+0100')[0];
};

Element.prototype.isProducteurOrAmap = function () 
{		
	return ($.inArray( this.type, [ "producteur", "amap" ] ) > -1);
};

Element.prototype.isCurrentStarChoiceRepresentant = function () 
{		
	if ( this.starChoiceForRepresentation !== '')
	{
		var elementStarId = App.getConstellation().getStarFromName(this.starChoiceForRepresentation).getElementId();
		return (this.id == elementStarId);
	}
	return false;	
};









// --------------------------------------------
//            SETTERS GETTERS
// ---------------------------------------------

Element.prototype.getId = function () 
{		
	return this.id;
};

Element.prototype.getPosition = function () 
{		
	return this.position;
};

Element.prototype.getName = function () 
{		
	return this.name;
};

Element.prototype.getMainProduct = function () 
{		
	return this.mainProduct;
};

Element.prototype.getProducts = function () 
{		
	return this.products;
};

Element.prototype.getMarker= function () 
{		
	return this.biopenMarker_.getRichMarker();
};

Element.prototype.getBiopenMarker = function (initialize) 
{		
	initialize = initialize || false;
	if (initialize) this.initialize();
	return this.biopenMarker_;
};

Element.prototype.isVisible = function () 
{		
	return this.isVisible_;
};

Element.prototype.isInitialized = function () 
{		
	return this.isInitialized_;
};


