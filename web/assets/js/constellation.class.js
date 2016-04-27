function Constellation(constellationPhp) 
{
	this.stars_ = [];
	var star;

	//$.each(constellationPhp.stars, function( name_star, star )
	for(var name_star in constellationPhp.stars) 
	{
		star = new Star(name_star, constellationPhp.stars[name_star].providerList);
		this.stars_.push(star);
	}

	this.geocodeResult_ = constellationPhp['geocodeResult']; 

	
}

Constellation.prototype.getOrigin = function () 
{
	return new google.maps.LatLng(this.geocodeResult_.coordinates.latitude, this.geocodeResult_.coordinates.longitude) ;
};

Constellation.prototype.getGeocodeResult = function () 
{
	return this.geocodeResult_;
};

Constellation.prototype.getStars = function () 
{
	return this.stars_ ;
};

/*
Constellation.prototype.draw = function () 
{	
	var curr_star;
	var marker;

	for(var i = 0; i < this.stars_.length; i++)
	{
  		curr_star = this.stars_[i];

  		marker = createMarker(curr_star.getPosition(), curr_star.getProvider().id, curr_star.getName().toLowerCase());  		

  		//var polyline = drawLineBetweenPoints(marker_home, marker, provider.type);

  		curr_star.setMarker(marker);
  		//star['line'] = polyline;

	}	
};*/



Constellation.prototype.getStarFromName = function(name)
{
	for(var i = 0; i < this.stars_.length; i++)
	{		
		if (this.stars_[i].getName() == name) 
		{
			return this.stars_[i];
		}
	}

	return null;
}



