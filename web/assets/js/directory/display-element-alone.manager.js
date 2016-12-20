/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function DisplayElementAloneManager() 
{
	this.elementShownAlone_ = null;
}

DisplayElementAloneManager.prototype.begin = function (elementId, panToElementLocation) 
{	
	//window.console.log("DisplayElementAloneManager begin");

	panToElementLocation = panToElementLocation !== false;

	if (this.elementShownAlone_ !== null) 
	{
		this.elementShownAlone_.hide();
		this.elementShownAlone_.isShownAlone = false;
	}

	if (constellationMode) App.getElementManager().focusOnThesesElements([elementId]);
	else 
	{
		/*var elements = App.getElementManager().getElements();

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

		App.getElementManager().clearMarkers();
	}	
	
	var element = App.getElementManager().getElementById(elementId); 
	this.elementShownAlone_ = element;
	element.show();	
	element.isShownAlone = true;

	App.getElementInfoBar().showElement(elementId);

	if (panToElementLocation)
	{
		var map = App.getMap();
		panMapToLocation(element.getPosition(), map, false);
	}
};


DisplayElementAloneManager.prototype.end = function () 
{	

	if (this.elementShownAlone_ === null) return;

	if (constellationMode) App.getElementManager().clearFocusOnThesesElements([this.elementShownAlone_.getId()]);
	else 
	{
		this.elementShownAlone_.hide();
		App.getElementManager().updateElementList(true,true);
	}
	
	this.elementShownAlone_.isShownAlone = false;	

	this.elementShownAlone_ = null;	
};

