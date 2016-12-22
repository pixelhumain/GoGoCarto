function GeocoderModule()
{
	classExtends(GeocoderModule, EventEmitter);
}

GeocoderModule.prototype.geocodeAddress = function( address, callbackComplete, callbackFail ) {

	console.log("geocode address : ", address);
	var geocoder = new google.maps.Geocoder();
	var that = this;
	geocoder.geocode( { 'address': address}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			if (callbackComplete) callbackComplete(results);
			console.log("results", results);

			var zoom = that.calculateAppropriateZoomForResults(results[0]);
			that.emitEvent("complete", [results[0].geometry.location, zoom]);			
		} 	
		else
		{
			if (callbackFail) callbackFail();			
		}
	});
};

GeocoderModule.prototype.calculateAppropriateZoomForResults = function( result) {
	// TODO
	return 12;
};