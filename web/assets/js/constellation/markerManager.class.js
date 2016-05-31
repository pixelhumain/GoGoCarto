function MarkerManager() 
{
	this.markers_= [];
	this.markerHome_ = null;
	this.clusterLines_ = [];	
}

MarkerManager.prototype.createMarkers = function () 
{	
	var list = GLOBAL.getProviders();
	var marker, provider;
	for(var i = 0; i < list.length; i++)
	{
		provider = list[i];
		provider.initialize();
		this.markers_.push(provider.getBiopenMarker());
	}	

	this.markerHome_ = new RichMarker({
		position: GLOBAL.getConstellation().getOrigin(),
	});
};

MarkerManager.prototype.fitMapInBounds = function () 
{	
	var bounds = new google.maps.LatLngBounds();

	bounds.extend(this.markerHome_.getPosition());

	for (var i = 0; i < this.markers_.length; i++) {
		if (this.markers_[i].getVisible()) bounds.extend(this.markers_[i].getPosition());
	};

	if (GLOBAL.getClusterer())
	{
		var clusters = GLOBAL.getClusterer().getMinimizedClusters();
		
		for (var i = 0; i < clusters.length; i++)
		{
			bounds.extend(clusters[i].getCenter());
		}
	}
	window.console.log("fitMapInBounds");
	GLOBAL.getMap().fitBounds(bounds);
	window.console.log("map get Zoom = " + GLOBAL.getMap().getZoom());
};

MarkerManager.prototype.draw = function () 
{	
	for(var i = 0; i < GLOBAL.getConstellation().getStars().length; i++)
	{
		providerId = GLOBAL.getConstellation().getStars()[i].getProvider().id;
		this.getMarkerById(providerId).show();
	}
};


MarkerManager.prototype.getMarkerById = function (providerId) 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		if (this.markers_[i].getId() == providerId) return this.markers_[i]
	}
	return null;
};



MarkerManager.prototype.hidePartiallyAllMarkers = function () 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		this.markers_[i].showHalfHidden();
	}
};

MarkerManager.prototype.showNormalHiddenAllMarkers = function () 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		this.markers_[i].showNormalHidden();
	}
};

MarkerManager.prototype.focusOnThesesMarkers = function (idList, starName) 
{
	this.hidePartiallyAllMarkers();

	for(var i = 0; i < idList.length; i++)
	{
		var marker = this.getMarkerById(idList[i]);
		marker.starChoiceForRepresentation = starName;
		marker.updateIcon();
		marker.showNormalHidden();
		marker.show();			
	}

};

MarkerManager.prototype.clearFocusOnThesesMarkers = function (idList) 
{
	this.showNormalHiddenAllMarkers();
	var marker;
	for(var i = 0; i < idList.length; i++)
	{
		marker = this.getMarkerById(idList[i]);
		marker.starChoiceForRepresentation = '';
		marker.updateIcon();		
		marker.hide();
		
		
	}
	for(var i = 0; i < this.markers_.length; i++)
	{
		this.markers_[i].showNormalSize();
	}

	this.draw();
};

MarkerManager.prototype.drawLinesWithClusters = function () 
{
	var i, line;

	// remove previous lines with clusters
	for (i = 0; i < this.clusterLines_.length; i++)
	{
		this.clusterLines_[i].setMap(null);
	}
	this.clusterLines_ = [];	
		
	// draw lines with clusters
	if (GLOBAL.getClusterer() != null) 
	{
		var clusters = GLOBAL.getClusterer().getMinimizedClusters();
		
		for (i = 0; i < clusters.length; i++)
		{
			line = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), clusters[i].getCenter(), 'cluster');
			this.clusterLines_.push(line);
		}
	}
}

MarkerManager.prototype.getMarkersIncludingHome = function () 
{
	var array = [];
	array.push(this.markerHome_);
	array = array.concat(this.getMarkers());
	return array;
};

MarkerManager.prototype.getMarkers = function () 
{
	var array = [];
	for(var i = 0; i < this.markers_.length; i++)
	{
		array.push(this.markers_[i].getRichMarker());
	}
	return array;
};

MarkerManager.prototype.getMarkerHome = function () 
{
	return this.markerHome_ ;
};

