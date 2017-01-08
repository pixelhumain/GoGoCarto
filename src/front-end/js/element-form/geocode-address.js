// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	var geocoding_ok;

	geocoder.geocode( address, function(results, status) 
	{
		if (results !== null && results.length > 0) 
		{
			fitBounds(results[0].getBounds());
			//map.setView(results[0].getCoordinates(), 15);
			createMarker(results[0].getCoordinates());

			$('#input-latitude').val(marker.getLatLng().lat);
			$('#input-longitude').val(marker.getLatLng().lng);
			geocoding_ok = true;				
		} 	
		else
		{
			geocoding_ok = false;		
		}	
	});

	return geocoding_ok;
}