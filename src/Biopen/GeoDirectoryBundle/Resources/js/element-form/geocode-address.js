var geocoderJS;
var geocodingProcessing = false;
var firstGeocodeDone = false;
var geocodedFormatedAddress = '';

function getInputAddress() { return $('#input-address').val(); }

jQuery(document).ready(function()
{	
	// geocoderJS = GeocoderJS.createGeocoder({'provider': 'google', 'useSSL':true});
	geocoderJS = GeocoderJS.createGeocoder({ 'provider': 'openstreetmap', 'useSSL':true});

	// Geocoding address
	$('#input-address').change(function () 
  { 
    if (!firstGeocodeDone) handleInputAdressChange(); 
  });

	$('#input-address').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleInputAdressChange();
		}
	});
  
	$('.btn-geolocalize').click(function () { handleInputAdressChange(); });
});

function handleInputAdressChange()
{
	geocodeAddress(getInputAddress());
}

function geocodeAddress(address) {

	console.log("geocodeAddress", address);

	if (geocodingProcessing || !address) { console.log("Already processing or no address provided", address); return null; }

	$('#geocode-spinner-loader').show();

	geocodingProcessing = true;

	geocoderJS.geocode(address, function(results, status) 
	{
		if (results !== null && results.length > 0) 
		{
			firstGeocodeDone = true;
			//fitBounds(results[0].getBounds());
			map.setView(results[0].getCoordinates(), 15);
			createMarker(results[0].getCoordinates());

			console.log("Geocode result :", results[0]);

			// Detect street address when geocoder fails to retrieve it (OSM case)
			var patt = new RegExp(/^\d+/g);
			var potentialStreetNumber = patt.exec(address);
			var streetNumber = results[0].streetNumber;
			if (potentialStreetNumber != results[0].postal_code && !results[0].streetNumber && results[0].streetName)
			{
				console.log("street number detected", potentialStreetNumber);
				streetNumber = potentialStreetNumber;
			}

			streetAddress = '';
			if (streetNumber && results[0].streetName) streetAddress += streetNumber + ' ';
			if (results[0].streetName) streetAddress +=  results[0].streetName;		

			geocodedFormatedAddress = "";
	    if (streetAddress) geocodedFormatedAddress += streetAddress + ', ';
	    if (results[0].postal_code) geocodedFormatedAddress += results[0].postal_code + ' ';
	    if (results[0].city) geocodedFormatedAddress += results[0].city;

			$('#input-latitude').val(marker.getLatLng().lat);
			$('#input-longitude').val(marker.getLatLng().lng);
			$('#input-postal-code').val(results[0].postal_code);
			$('#input-country').val(results[0].country_code);
			$('#input-city').val(results[0].city);
			$('#input-streetAddress').val(streetAddress);				

			$('#input-address').val(geocodedFormatedAddress);			

			$('#input-address').closest('.input-field').removeClass("error");	
			$('#input-address').removeClass('invalid');
		} 	
		else
		{
			$('#input-address').addClass("invalid");
			$('#input-address').closest('.input-field').addClass("error");

			if (marker) marker.remove();

			$('.geolocalize-help-text').show();

			$('#input-latitude').val('');
			$('#input-longitude').val('');
			$('#input-postal-code').val('');
			$('#input-city').val('');	
			$('#input-country').val('');			
			$('#input-streetAddress').val('');

			console.log("erreur geocoding", status);
		}

		$('#geocode-spinner-loader').hide();
		geocodingProcessing = false;
	});
}

function checkCustomFormatedAddressBeforeSend()
{
	if (getInputAddress() != geocodedFormatedAddress)
	{
		$('#input-custom-formated-address').val(getInputAddress());
	}
	else
	{
		$('#input-custom-formated-address').val(null);
	}
}