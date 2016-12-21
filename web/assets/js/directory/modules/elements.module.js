/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function ElementsModule(listElementPhp) 
{
	classExtends(ElementsModule, EventEmitter);

	this.allElements_ = [];
	
	// current visible elements
	this.currElements_ = [];

	this.allElementsIds_= [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	cookies = readCookie('FavoriteIds');
	if (cookies !== null)
	{
		this.favoriteIds_ = JSON.parse(cookies);		
	}   
	else this.favoriteIds_ = [];	

	//this.addJsonElements(listElementPhp, false);

	// TODO delete listElementPhp; ?
}

ElementsModule.prototype.checkCookies = function()
{
	for(var j = 0; j < this.favoriteIds_.length; j++)
  	{
  		this.addFavorite(this.favoriteIds_[j], false);
  	}
};

ElementsModule.prototype.addJsonElements = function (elementList, checkIfAlreadyExist)
{
	var element;
	var newElementsCount = 0;
	for (var i = 0; i < elementList.length; i++)
	{
		elementJson = elementList[i].Element ? elementList[i].Element : elementList[i];

		if (!checkIfAlreadyExist || this.allElementsIds_.indexOf(elementJson.id) < 0)
		{
			this.allElements_.push(new Element(elementJson));
			this.allElementsIds_.push(elementJson.id);
			newElementsCount++;
		}
		else
		{
			//console.log("addJsonElements, cet element existe deja");
		}		
	}
	this.checkCookies();
	//window.console.log("addJsonElements newElementsCount = " + newElementsCount);
};

ElementsModule.prototype.addFavorite = function (favoriteId, modifyCookies)
{
	modifyCookies = modifyCookies !== false;
	var element = this.getElementById(favoriteId);
	if (element !== null) element.isFavorite = true;
	else return;
	
	if (modifyCookies)
	{
		this.favoriteIds_.push(favoriteId);
		createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));		
	}
};

ElementsModule.prototype.removeFavorite = function (favoriteId, modifyCookies)
{
	modifyCookies = modifyCookies !== false;
	var element = this.getElementById(favoriteId);
	if (element !== null) element.isFavorite = false;
	
	if (modifyCookies)
	{
		var index = this.favoriteIds_.indexOf(favoriteId);
		if (index > -1) this.favoriteIds_.splice(index, 1);

		createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));
	}
};

// check elements in bounds and who are not filtered
ElementsModule.prototype.updateElementToDisplay = function (checkInAllElements, forceRepaint) 
{	
	checkInAllElements = checkInAllElements !== false;
	forceRepaint = forceRepaint || false;

	var elements = null;
	if (checkInAllElements || this.currElements_.length === 0) elements = this.allElements_;
	else elements = this.currElements_;

	var i, element;
 	var mapBounds = App.getMap().getBounds();   

 	var newMarkers = [];
 	var markersToRemove = [];
 	var markersChanged = false;

	var filterModule = App.getFilterModule();	

	i = elements.length;
	window.console.log("UpdateElementToDisplay. Nbre element à traiter : " + i, checkInAllElements);
	var start = new Date().getTime();

	
	while(i-- /*&& this.currElements_.length < App.getMaxElements()*/)
	{
		element = elements[i];
		
		if (mapBounds.contains(element.getPosition()) && filterModule.checkIfElementPassFilters(element))
		{
			if (!element.isVisible() && $.inArray(App.getState(), [App.States.Normal,App.States.ShowElement]) > -1)
			{
				if (element.isInitialized() === false) element.initialize();
				element.show();
				this.currElements_.push(element);
				newMarkers.push(element.getMarker());
				markersChanged = true;
			}
		}
		else
		{
			if (element.isVisible() && !element.isShownAlone ) 
			{
				element.hide();
				markersToRemove.push(element.getMarker());
				markersChanged = true;
				var index = this.currElements_.indexOf(element);
				if (index > -1) this.currElements_.splice(index, 1);
			}
		}
	}

	// if (this.currElements_.length >= App.getMaxElements())
	// {
	// 	/*$('#too-many-markers-modal').show().fadeTo( 500 , 1);
	// 	this.clearMarkers();		
	// 	return;*/
	// 	//console.log("Toomany markers. Nbre markers : " + this.currElements_.length + " // MaxMarkers = " + App.getMaxElements());
	// }
	// else
	// {
	// 	$('#too-many-markers-modal:visible').fadeTo(600,0, function(){ $(this).hide(); });
	// }

	var end = new Date().getTime();
	var time = end - start;
	window.console.log("    analyse elements en " + time + " ms");	
	
	if (markersChanged || forceRepaint)
	{		
		this.emitEvent("change", [newMarkers, markersToRemove]);			
	}
	
};

ElementsModule.prototype.getElements = function () 
{
	return this.currElements_;
};

ElementsModule.prototype.getAllElementsIds = function () 
{
	return this.allElementsIds_;
};

ElementsModule.prototype.clearMarkers = function()
{
	this.hideAllMarkers();
	this.currElements_ = [];
	App.getClusterer().clearMarkers();	
};

ElementsModule.prototype.getMarkers = function () 
{
	var markers = [];
	l = this.currElements_.length;
	while(l--)
	{
		markers.push(this.currElements_[l].getMarker());
	}
	return markers;
};

ElementsModule.prototype.hidePartiallyAllMarkers = function () 
{
	l = this.currElements_.length;
	while(l--)
	{
		this.currElements_[l].getBiopenMarker().showHalfHidden();
	}
};

ElementsModule.prototype.hideAllMarkers = function () 
{
	l = this.currElements_.length;
	while(l--)
	{
		this.currElements_[l].hide();
	}
};

ElementsModule.prototype.showNormalHiddenAllMarkers = function () 
{
	l = this.allElements_.length;
	while(l--)
	{
		this.currElements_[l].getBiopenMarker().showNormalHidden();
	}
};

ElementsModule.prototype.getElementById = function (elementId) 
{
	//return this.allElements_[elementId];
	for (var i = 0; i < this.allElements_.length; i++) {
		if (this.allElements_[i].getId() == elementId) return this.allElements_[i];
	}
	return null;
};