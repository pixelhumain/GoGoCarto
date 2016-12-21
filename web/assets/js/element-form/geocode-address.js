// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	var geocoding_ok;
	geocoder.geocode( { 'address': address}, function(results, status) {

	if (status == google.maps.GeocoderStatus.OK) 
	{
		map.panTo(results[0].geometry.location);
		map.setZoom(16);
		marker.setPosition(results[0].geometry.location);
		$('#input-latitude').val(marker.getPosition().lat());
		$('#input-longitude').val(marker.getPosition().lng());	

		geocoding_ok = true;	
	} 
	else 
	{
		geocoding_ok = false;	
	}
	});
	return geocoding_ok;
}