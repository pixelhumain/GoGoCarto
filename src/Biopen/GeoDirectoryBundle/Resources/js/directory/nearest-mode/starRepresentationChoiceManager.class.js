/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function StarRepresentationChoiceModule() 
{
	this.currentStar_ = null;
	this.idFocused_ = null;
}

StarRepresentationChoiceModule.prototype.begin = function (star) 
{	
	this.currentStar_ = star;
	let idToFocus = star.getdirectory-content-listId();

	let element;
	for(let i = 0; i < idToFocus.length; i++)
	{
		element = App.elementModule.getElementById(idToFocus[i]);
		element.starChoiceForRepresentation = star.getName();	
	}

	App.setState(AppStates.StarRepresentationChoice);

	App.elementModule.focusOnThesesElements(idToFocus);
	App.clusterer().repaint();

	//$('.SRC-helper-starName').html(star.getName());
	//$('#element-info-bar').addClass('starRepresentantMode');
	//$('.starRepresentationChoice-helper').show();

	this.majView();	

	hideBandeauHelper();
};


StarRepresentationChoiceModule.prototype.end = function () 
{	
	if (this.currentStar_ === null) return;

	let idToClearFocus = this.currentStar_.getdirectory-content-listId();

	let element;
	for(let i = 0; i < idToClearFocus.length; i++)
	{
		element = App.elementModule.getElementById(idToClearFocus[i]);
		element.starChoiceForRepresentation = '';	
	}

	App.elementModule.clearFocusOnThesesElements(idToClearFocus);
	App.clusterer().repaint();	

	App.getInfoBar().hide()(); 

	this.currentStar_ = null;

	//$('.starRepresentationChoice-helper').hide();
	//$('#element-info-bar').removeClass('starRepresentantMode');

	//ajuster_taille_elementList();

	//App.setState(AppStates.Normal);
};

StarRepresentationChoiceModule.prototype.selectElementIndex = function (elementIndex) 
{
	this.currentStar_.setIndex(elementIndex);
	App.infoBarComponent.showElement(this.currentStar_.getElementId(), false);
	this.majView();	
};

StarRepresentationChoiceModule.prototype.majView = function ()
{
	let elementId = this.currentStar_.getElementId();

	/*$('#directory-content-list .starRepresentant').removeClass('starRepresentant');
	$('#directory-content-list #element-info-'+elementId).addClass('starRepresentant');*/

	$('.moreResultContainer:visible .starElement').removeClass('starElement');
	$('#moreResult-'+this.currentStar_.getName()+'-'+this.currentStar_.getIndex()).addClass("starElement");	
};

StarRepresentationChoiceModule.prototype.selectElementById = function (elementId)
{
	let elementIndex = this.currentStar_.getElementIndexFromId(elementId);	
	this.selectElementIndex(elementIndex);
};

