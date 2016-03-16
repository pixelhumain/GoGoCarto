jQuery(document).ready(function()
{	
	/*var addressPicker = new AddressPicker();

	$('#inputAdresse').typeahead(null, {
	  displayKey: 'description',
	  source: addressPicker.ttAdapter()
	});*/


});

function initMap() 
{	
	var options = {
	  componentRestrictions: {country: 'fr'}
	};
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputAdresse', options));
}