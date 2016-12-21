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
	$('#element-info-bar .btn-select-as-representant').click(function(event) 
	{ 
		var elementId = $('#element-info-bar .element-item').attr('data-element-id');
		App.getSRCModule().selectElementById( elementId ); 		
	});
});

function ElementModule(listElementPhp) 
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

ElementModule.prototype.draw = function () 
{	
	var element;
	for(var i = 0; i < App.getConstellation().getStars().length; i++)
	{
		element = App.getConstellation().getStars()[i].getElement();	
		element.show();	
	}	
};

ElementModule.prototype.focusOnThesesElements = function (idList) 
{
	App.getMarkerModule().hidePartiallyAllMarkers();

	var element;	

	for(var i = 0; i < idList.length; i++)
	{
		element = this.getElementById(idList[i]);			
		element.getBiopenMarker().updateIcon();
		element.getBiopenMarker().showNormalHidden();				
		element.show();		
	}
};

ElementModule.prototype.clearFocusOnThesesElements = function (idList) 
{
	App.getMarkerModule().showNormalHiddenAllMarkers();

	var marker;
	for(var i = 0; i < idList.length; i++)
	{
		element = this.getElementById(idList[i]);	
		//marker.updateIcon();		
		element.hide();		
	}

	this.draw();
};

ElementModule.prototype.getElements = function () 
{
	return this.elements_;
};

ElementModule.prototype.getElementById = function (elementId) 
{
	for (var i = 0; i < this.elements_.length; i++) 
	{
		if (this.elements_[i].getId() == elementId) return this.elements_[i];
	}
};