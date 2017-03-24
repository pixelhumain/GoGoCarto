var geocoding_processing = false;
// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	if (geocoding_processing) return null;

	geocoding_processing = true;

	geocoder.geocode( address, function(results, status) 
	{
		if (results !== null && results.length > 0) 
		{
			//fitBounds(results[0].getBounds());
			map.setView(results[0].getCoordinates(), 15);
			createMarker(results[0].getCoordinates());

			//console.log("Geocode result :", results[0].postal_code);

			$('#input-latitude').val(marker.getLatLng().lat);
			$('#input-longitude').val(marker.getLatLng().lng);
			$('#input-postal-code').val(results[0].postal_code);	
			$('#input-address').siblings('i').removeClass("error");	
		} 	
		else
		{
			$('#input-address').addClass("invalid");
			$('#input-address').siblings('i').addClass("error");

			if (marker) marker.remove();

			$('#input-latitude').val();
			$('#input-longitude').val();
			$('#input-postal-code').val();		

			console.log("errur geocoding");
		}	
		
		geocoding_processing = false;
	});

	return geocoding_ok;
}