/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function StarRepresentationChoiceManager() 
{
	this.currentStar_ = null;
	this.idFocused_ = null;
}

StarRepresentationChoiceManager.prototype.begin = function (star) 
{	
	this.currentStar_ = star;
	var idToFocus = star.getElementListId();

	var element;
	for(var i = 0; i < idToFocus.length; i++)
	{
		element = App.getElementManager().getElementById(idToFocus[i]);
		element.starChoiceForRepresentation = star.getName();	
	}

	App.setState('starRepresentationChoice');

	App.getElementManager().focusOnThesesElements(idToFocus);
	App.getClusterer().repaint();

	//$('.SRC-helper-starName').html(star.getName());
	//$('#element-info-bar').addClass('starRepresentantMode');
	//$('.starRepresentationChoice-helper').show();

	this.majView();	

	hideBandeauHelper();
};


StarRepresentationChoiceManager.prototype.end = function () 
{	
	if (this.currentStar_ === null) return;

	var idToClearFocus = this.currentStar_.getElementListId();

	var element;
	for(var i = 0; i < idToClearFocus.length; i++)
	{
		element = App.getElementManager().getElementById(idToClearFocus[i]);
		element.starChoiceForRepresentation = '';	
	}

	App.getElementManager().clearFocusOnThesesElements(idToClearFocus);
	App.getClusterer().repaint();	

	animateDownElementInfoBar(); 

	this.currentStar_ = null;

	//$('.starRepresentationChoice-helper').hide();
	//$('#element-info-bar').removeClass('starRepresentantMode');

	//ajuster_taille_elementList();

	//App.setState('normal');
};

StarRepresentationChoiceManager.prototype.selectElementIndex = function (elementIndex) 
{
	this.currentStar_.setIndex(elementIndex);
	App.getElementInfoBar().showElement(this.currentStar_.getElementId(), false);
	this.majView();	
};

StarRepresentationChoiceManager.prototype.majView = function ()
{
	var elementId = this.currentStar_.getElementId();

	/*$('#ElementList .starRepresentant').removeClass('starRepresentant');
	$('#ElementList #element-info-'+elementId).addClass('starRepresentant');*/

	$('.moreResultContainer:visible .starElement').removeClass('starElement');
	$('#moreResult-'+this.currentStar_.getName()+'-'+this.currentStar_.getIndex()).addClass("starElement");	
};

StarRepresentationChoiceManager.prototype.selectElementById = function (elementId)
{
	var elementIndex = this.currentStar_.getElementIndexFromId(elementId);	
	this.selectElementIndex(elementIndex);
};

