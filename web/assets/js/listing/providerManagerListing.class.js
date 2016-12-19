/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function ElementManagerListing(listElementPhp) 
{
	this.allElements_ = [];
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

	this.addJsonElements(listElementPhp, false);

	// TODO delete listElementPhp; ?
}

ElementManagerListing.prototype.checkCookies = function()
{
	for(var j = 0; j < this.favoriteIds_.length; j++)
  	{
  		this.addFavorite(this.favoriteIds_[j], false);
  	}
};

ElementManagerListing.prototype.addJsonElements = function (elementList, checkIfAlreadyExist)
{
	var element;
	var newElements = 0;
	for (var i = 0; i < elementList.length; i++)
	{
		elementJson = elementList[i].Element ? elementList[i].Element : elementList[i];

		if (!checkIfAlreadyExist || this.allElementsIds_.indexOf(elementJson.id) < 0)
		{
			this.allElements_.push(new Element(elementJson));
			this.allElementsIds_.push(elementJson.id);
			newElements++;
		}		
	}
	this.checkCookies();
	//window.console.log("addJsonElements newElements = " + newElements);
};

ElementManagerListing.prototype.addFavorite = function (favoriteId, modifyCookies)
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

ElementManagerListing.prototype.removeFavorite = function (favoriteId, modifyCookies)
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

ElementManagerListing.prototype.updateElementList = function (checkInAllElements, forceRepaint) 
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

	filterManager = App.getFilterManager();

	i = elements.length;

	window.console.log("UpdateElementList nbre element " + i, checkInAllElements);
	var start = new Date().getTime();

	while(i-- /*&& this.currElements_.length < App.getMaxElements()*/)
	{
		element = elements[i];
		
		if (mapBounds.contains(element.getPosition()) && filterManager.checkIfElementPassFilters(element))
		{
			if (!element.isVisible() && $.inArray(App.getState(), ["normal","showElement"]) > -1)
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

	if (this.currElements_.length >= App.getMaxElements())
	{
		/*$('#tooManyMarkers_modal').show().fadeTo( 500 , 1);
		this.clearMarkers();		
		return;*/
		console.log("Toomany markers. Nbre markers : " + this.currElements_.length + " // MaxMarkers = " + App.getMaxElements());
	}
	else
	{
		$('#tooManyMarkers_modal:visible').fadeTo(600,0, function(){ $(this).hide(); });
	}

	var end = new Date().getTime();
	var time = end - start;
	//window.console.log("    analyse elements en " + time + " ms");	
	
	if (markersChanged || forceRepaint)
	{		
		App.getClusterer().addMarkers(newMarkers,true);
		App.getClusterer().removeMarkers(markersToRemove, true);
		
		App.getClusterer().repaint();		
	}
	
};

ElementManagerListing.prototype.getElements = function () 
{
	return this.currElements_;
};

ElementManagerListing.prototype.getAllElementsIds = function () 
{
	return this.allElementsIds_;
};

ElementManagerListing.prototype.clearMarkers = function()
{
	this.hideAllMarkers();
	this.currElements_ = [];
	App.getClusterer().clearMarkers();	
};

ElementManagerListing.prototype.getMarkers = function () 
{
	var markers = [];
	l = this.currElements_.length;
	while(l--)
	{
		markers.push(this.currElements_[l].getMarker());
	}
	return markers;
};

ElementManagerListing.prototype.hidePartiallyAllMarkers = function () 
{
	l = this.currElements_.length;
	while(l--)
	{
		this.currElements_[l].getBiopenMarker().showHalfHidden();
	}
};

ElementManagerListing.prototype.hideAllMarkers = function () 
{
	l = this.currElements_.length;
	while(l--)
	{
		this.currElements_[l].hide();
	}
};

ElementManagerListing.prototype.showNormalHiddenAllMarkers = function () 
{
	l = this.allElements_.length;
	while(l--)
	{
		this.currElements_[l].getBiopenMarker().showNormalHidden();
	}
};

ElementManagerListing.prototype.getElementById = function (elementId) 
{
	//return this.allElements_[elementId];
	for (var i = 0; i < this.allElements_.length; i++) {
		if (this.allElements_[i].getId() == elementId) return this.allElements_[i];
	}
	return null;
};