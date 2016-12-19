/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
jQuery(document).ready(function()
{	
	$('#inputAddress').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleSearchAction();
		}
	});
	$('#inputAddress-icon').click(function()
	{		
		handleSearchAction();
	});	
	$('#inputAddress').on("place_changed", handleSearchAction);
});

function handleSearchAction()
{
	var inputAddress = $('#inputAddress');
	if (inputAddress.val())	inputAddress.trigger("search", [ inputAddress.val() ]);
}