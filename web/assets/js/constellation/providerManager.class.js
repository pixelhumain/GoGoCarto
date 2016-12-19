/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
jQuery(document).ready(function()
{	
	$('#bandeau_detail .btn-select-as-representant').click(function(event) 
	{ 
		var elementId = $('#bandeau_detail .elementItem').attr('data-element-id');
		App.getSRCManager().selectElementById( elementId ); 		
	});
});

function ElementManager(listElementPhp) 
{
	this.elements_ = [];

	// TODO timer pour voir si c'est long de faire ça. peut etre le faire
	// direct dans la page twig? pour éviter de serializer....

	var element;
	for (var i = 0; i < listElementPhp.length; i++)
	{
		element = new Element(listElementPhp[i]);
		this.elements_.push(element);
	}
}

ElementManager.prototype.draw = function () 
{	
	var element;
	for(var i = 0; i < App.getConstellation().getStars().length; i++)
	{
		element = App.getConstellation().getStars()[i].getElement();	
		element.show();	
	}	
};

ElementManager.prototype.focusOnThesesElements = function (idList) 
{
	App.getMarkerManager().hidePartiallyAllMarkers();

	var element;	

	for(var i = 0; i < idList.length; i++)
	{
		element = this.getElementById(idList[i]);			
		element.getBiopenMarker().updateIcon();
		element.getBiopenMarker().showNormalHidden();				
		element.show();		
	}
};

ElementManager.prototype.clearFocusOnThesesElements = function (idList) 
{
	App.getMarkerManager().showNormalHiddenAllMarkers();

	var marker;
	for(var i = 0; i < idList.length; i++)
	{
		element = this.getElementById(idList[i]);	
		//marker.updateIcon();		
		element.hide();		
	}

	this.draw();
};

ElementManager.prototype.getElements = function () 
{
	return this.elements_;
};

ElementManager.prototype.getElementById = function (elementId) 
{
	for (var i = 0; i < this.elements_.length; i++) 
	{
		if (this.elements_[i].getId() == elementId) return this.elements_[i];
	}
};