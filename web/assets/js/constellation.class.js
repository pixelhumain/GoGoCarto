function Constellation(map, constellationPhp) 
{
	this.map_ = map;
	this.stars_ = [];
	var star;

	//$.each(constellationPhp.etoiles, function( nom_etoile, etoile )
	for(var nom_etoile in constellationPhp.etoiles) 
	{
		star = new Star(nom_etoile, constellationPhp.etoiles[nom_etoile].fournisseurList);
		this.stars_.push(star);
	}

	this.geocodeResult_ = constellationPhp['geocodeResult'];    

    this.markerHome_ = new google.maps.Marker({
		map: this.map_,
		position: this.getOrigin(),
		draggable: false,
		icon: {
	      path: google.maps.SymbolPath.CIRCLE,
	      scale: 10,
	      strokeColor: '#F7584C',
	      strokeWeight: 5
	    },
		animation: google.maps.Animation.DROP,
	});		
}

Constellation.prototype.getOrigin = function () 
{
	return new google.maps.LatLng(this.geocodeResult_.coordinates.latitude, this.geocodeResult_.coordinates.longitude) ;
};

Constellation.prototype.getMarkerHome = function () 
{
	return this.markerHome_ ;
};

Constellation.prototype.getGeocodeResult = function () 
{
	return this.geocodeResult_;
};

Constellation.prototype.getStars = function () 
{
	return this.stars_ ;
};

Constellation.prototype.getStar = function (nom) 
{
	for(var i = 0; i < this.stars_.length; i++)
	{
		if (this.stars_[i].getNom() == nom) return this.stars_[i]
	}
	return null;
};

Constellation.prototype.getMarkers = function () 
{
	var array = [];
	for(var i = 0; i < this.stars_.length; i++)
	{
		if (this.stars_[i].getMarker() != null) array.push(this.stars_[i].getMarker());
	}
	return array;
};

Constellation.prototype.getMarkersIncludingHome = function () 
{
	var array = [];
	array.push(this.markerHome_);
	array = array.concat(this.getMarkers());
	return array;
};

Constellation.prototype.draw = function () 
{	
	var curr_star;
	var marker;

	for(var i = 0; i < this.stars_.length; i++)
	{
  		curr_star = this.stars_[i];

  		marker = createMarker(curr_star.getPosition(), curr_star.getFournisseur().id);  		

  		//var polyline = drawLineBetweenPoints(marker_home, marker, fournisseur.type);

  		curr_star.setMarker(marker);
  		//etoile['line'] = polyline;

	}	
};

Constellation.prototype.drawLines = function (cluster = null) 
{
	var i;
	for(var i = 0; i < this.stars_.length; i++)
	{
		if (this.stars_[i].isVisible()) 
			drawLineBetweenPoints(this.markerHome_.getPosition(), this.stars_[i].getPosition(), this.stars_[i].getFournisseur().type, this.map_)
	}
	
	if (cluster == null) return;
	var clusters = cluster.getMinimizedClusters();
	for (i = 0; i < clusters.length; i++)
	{
		drawLineBetweenPoints(this.markerHome_.getPosition(), clusters[i].getCenter(), 'cluster');
	}
}

