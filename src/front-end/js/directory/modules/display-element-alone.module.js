/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function DisplayElementAloneModule() 
{
	this.elementShownAlone_ = null;
}

DisplayElementAloneModule.prototype.begin = function (elementId, panToElementLocation) 
{	
	

	panToElementLocation = panToElementLocation !== false;

	window.console.log("DisplayElementAloneModule begin", panToElementLocation);

	if (this.elementShownAlone_ !== null) 
	{
		this.elementShownAlone_.hide();
		this.elementShownAlone_.isShownAlone = false;
	}

	if (constellationMode) App.getElementModule().focusOnThesesElements([element.id]);
	else 
	{
		/*var elements = App.getElementModule().getElements();

		l = elements.length;
		//window.console.log("hiding " + l + "elements");
		while(l--)
		{
			elements[l].hide();
		}

		var clusters = App.getClusterer().getClusters();
		l = clusters.length
		while(l--)
		{
			clusters[l].hide();
		}*/

		App.getElementModule().clearMarkers();
	}	
	
	var element = App.getElementById(elementId);
	this.elementShownAlone_ = element;
	element.show();	
	element.isShownAlone = true;

	App.getInfoBarComponent().showElement(element.id);

	if (panToElementLocation)
	{
		App.getMapComponent().panToLocation(element.getPosition(), null, false);
	}
};


DisplayElementAloneModule.prototype.end = function () 
{	

	if (this.elementShownAlone_ === null) return;

	if (constellationMode) App.getElementModule().clearFocusOnThesesElements([this.elementShownAlone_.getId()]);
	else 
	{
		this.elementShownAlone_.hide();
		App.getElementModule().updateElementToDisplay(true,true);
	}
	
	this.elementShownAlone_.isShownAlone = false;	

	this.elementShownAlone_ = null;	
};

