/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function ListElementModule() 
{
	
}

ListElementModule.prototype.draw = function () 
{
	$('#directory-content-list li').remove();

	let element, elementsPlacesToDisplay = [], elementsProducteurOrAmapToDisplay = [];
	for(let i = 0; i < App.constellation.getStars().length; i++)
	{
		element = App.constellation.getStars()[i].getElement();
		if (element.isProducteurOrAmap())
		{
			if (elementsProducteurOrAmapToDisplay.indexOf(element) == -1) elementsProducteurOrAmapToDisplay.push(element);
		}			
		else
		{
			if (elementsPlacesToDisplay.indexOf(element) == -1) elementsPlacesToDisplay.push(element);
		}			
	}

	elementsProducteurOrAmapToDisplay.sort(compareDistance);
	elementsPlacesToDisplay.sort(compareDistance);		

	for( i = 0; i < elementsPlacesToDisplay.length; i++)
	{
		element = elementsPlacesToDisplay[i];
		$('#directory-content-list #places-end-container').before(element.getHtmlRepresentation());
		createListenersForElementMenu($('#element-info-'+element.id +' .menu-element'));	
	}

	for( i = 0; i < elementsProducteurOrAmapToDisplay.length; i++)
	{
		element = elementsProducteurOrAmapToDisplay[i];
		$('#directory-content-list #producteurAmap-end-container').before(element.getHtmlRepresentation());
		createListenersForElementMenu($('#element-info-'+element.id +' .menu-element'));	
	}	

	$('#directory-content-list ul').animate({scrollTop: '0'}, 500).collapsible({
      accordion : true 
    });
	
};

function compareDistance(a,b) 
{  
  if (a.distance == b.distance) return 0;
  return a.distance < b.distance ? -1 : 1;
}

