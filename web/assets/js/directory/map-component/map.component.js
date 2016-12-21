function MapComponent()
{
	classExtends(MapComponent, EventEmitter);

	this.map_ = null;
	this.clusterer_ = null;
}

MapComponent.prototype.getMap = function(){ return this.map_; }; 
MapComponent.prototype.getClusterer = function() { return this.clusterer_; };

MapComponent.prototype.init = function() 
{	
	initRichMarker();
	initAutocompletion(document.getElementById('search-bar'));

	mapOptions = 
	{
		disableDefaultUI: true,
		zoomControl: true
	};

	this.map_ = new google.maps.Map(document.getElementById("directory-content-map"), mapOptions);	

	if (constellationMode || geocodeResponse === null)
	{
		// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		this.map_.setZoom(6);
		this.map_.setCenter(latlng);

		this.map_.locationAddress = $('#search-bar').val();
   		this.map_.locationSlug = capitalize(slugify($('#search-bar').val()));
	}	
	else
	{
		var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		this.map_.setCenter(center);
		this.panToLocation(center, map);
	}

	// Event Listeners
	var that = this;

	google.maps.event.addListener(this.map_, 'projection_changed', function () 
	{   
		$('#spinner-loader').hide();
		that.clusterer_ = initCluster(null);
		that.emitEvent("mapReady", []);
	});	

	google.maps.event.addListener(this.map_, 'idle', function(e)  { that.emitEvent("idle", []); });

	google.maps.event.addListener(this.map_, 'click', function(e) { that.emitEvent("click", []); });  	
};

MapComponent.prototype.panToAddress = function( address ) {

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			this.panToLocation(results[0].geometry.location);
			$('#search-bar').val(results[0].formatted_address);
			App.updateState();
		} 	
		else
		{
			$('#search-bar').addClass('invalid');
		}
	});
};

MapComponent.prototype.panToLocation = function(newLocation,changeMapLocation)
{
	changeMapLocation = changeMapLocation !== false;
	setTimeout(function() 
	{
		//on laisse 500ms le temps que l'animation du redimensionnement éventuel termine
		google.maps.event.trigger(this.map_, 'resize');
		this.map_.panTo(newLocation);
	},500);

	this.map_.setZoom(12);

	if (changeMapLocation)
	{
		this.map_.location = newLocation;	
		this.map_.locationAddress = $('#search-bar').val();
		this.map_.locationSlug = capitalize(slugify($('#search-bar').val()));		
	}	
};