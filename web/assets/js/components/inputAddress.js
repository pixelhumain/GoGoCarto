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
});

function handleSearchAction()
{
	var inputAddress = $('#inputAddress');
	if (inputAddress.val())	inputAddress.trigger("search", [ inputAddress.val() ]);
}

function initInputAddressAutocompletion()
{
	var options = {
	  componentRestrictions: {country: 'fr'}
	};
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputAddress', options));
}