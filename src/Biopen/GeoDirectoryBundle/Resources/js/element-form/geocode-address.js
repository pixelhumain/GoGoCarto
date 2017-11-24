var geocoding_processing = false;
// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	if (geocoding_processing || !address) return null;

	$('#geocode-spinner-loader').show();

	geocoding_processing = true;

	geocoderJS.geocode( address, function(results, status) 
	{
		if (results !== null && results.length > 0) 
		{
			//fitBounds(results[0].getBounds());
			map.setView(results[0].getCoordinates(), 15);
			createMarker(results[0].getCoordinates());

			console.log("Geocode result :", results[0]);

			$('#input-latitude').val(marker.getLatLng().lat);
			$('#input-longitude').val(marker.getLatLng().lng);
			$('#input-postal-code').val(results[0].postal_code);
			$('#input-city').val(results[0].city);
			streetAddress = '';
			if (results[0].streetNumber) streetAddress +=  results[0].streetNumber + ' ';
			if (results[0].streetName) streetAddress +=  results[0].streetName;
			$('#input-streetAddress').val(streetAddress);	
			$('#input-country').val(results[0].getCountyCode());
			$('#input-address').val(results[0].formattedAddress);
			$('#input-address').closest('.input-field').removeClass("error");	
			$('#input-address').removeClass('invalid');
		} 	
		else
		{
			$('#input-address').addClass("invalid");
			$('#input-address').closest('.input-field').addClass("error");

			if (marker) marker.remove();

			$('#input-latitude').val('');
			$('#input-longitude').val('');
			$('#input-postal-code').val('');
			$('#input-city').val('');	
			$('#input-country').val('');			
			$('#input-streetAddress').val('');

			console.log("erreur geocoding", status);
		}	
		$('#geocode-spinner-loader').hide();
		geocoding_processing = false;
	});

	return geocoding_ok;
}