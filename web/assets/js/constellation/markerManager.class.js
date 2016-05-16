function MarkerManager() 
{
	this.markers_= [];
	this.markerHome_ = null;
	this.clusterLines_ = [];	
}

MarkerManager.prototype.createMarkers = function () 
{	
	var list = GLOBAL.getProviders();
	var marker;
	for(var i = 0; i < list.length; i++)
	{
		marker = new BiopenMarker(list[i].id);
		this.markers_.push(marker); 
	}
	

	this.markerHome_ = new RichMarker({
		position: GLOBAL.getConstellation().getOrigin(),
	});
};

MarkerManager.prototype.checkMarkersInBounds = function () 
{
	startDate = new Date();
	var bounds = GLOBAL.getMap().getBounds();
	var nbre = 0;
	for (var i = 0, l = this.markers_.length; i < l; i++) 
	{
		if (bounds.contains(this.markers_[i].getPosition()))
		{
			nbre++;
			this.markers_[i].show();
		}
			
	}
	endDate = new Date();
	window.console.log('check markers in bounds : '+ nbre + ' temps : ' + (endDate - startDate) + ' ms');
}

MarkerManager.prototype.checkMarkersInBounds2 = function () 
{
	var startDate = new Date();
	var bounds = GLOBAL.getMap().getBounds();
	var nbre = 0;
	for (var i = 0, l; i < this.markers_.length; i++) 
	{
		if (bounds.contains(this.markers_[i].getPosition()))
		{
			nbre++;
			this.markers_[i].show();
		}
	}
	var endDate = new Date();
	window.console.log('check markers in bounds : '+ nbre + ' temps : ' +(endDate - startDate) + ' ms');
}

MarkerManager.prototype.createRandomMarkers = function () 
{				
	var startDate = new Date();
	// Add markers to the map at random locations
	var bounds = GLOBAL.getMap().getBounds();
	var southWest = bounds.getSouthWest();
	var northEast = bounds.getNorthEast();
	var lngSpan = northEast.lng() - southWest.lng();
	var latSpan = northEast.lat() - southWest.lat();				

	var latlng;
	var provider = [];
	for (var i = 0; i < 100; i++) 
	{		
		provider.id = 200 + i;
		provider.latlng = [];
		provider.latlng.latitude = southWest.lat() + latSpan * Math.random();
		provider.latlng.longitude = southWest.lng() + lngSpan * Math.random();
		provider.main_product = 'fruits';
		provider.products = [];
		marker = new BiopenMarker(provider);
		this.markers_.push(marker); 

		marker.show();
	} 
	providers = [];
	for (var i = 0; i < 30000; i++) 
	{		
		provider.id = 2000 + i;
		provider.latlng = [];
		provider.latlng.latitude = southWest.lat() + latSpan * Math.random();
		provider.latlng.longitude = southWest.lng() + lngSpan * Math.random();
		provider.main_product = 'fruits';
		provider.products = [];
		/*marker = new BiopenMarker(provider);
		this.markers_.push(marker); */
		providers.push(provider);

		
	} 

	var endDate = new Date();
	window.console.log('create markers : ' +(endDate - startDate) + ' ms');				
			
}

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

	GLOBAL.getMap().fitBounds(bounds);
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

MarkerManager.prototype.focusOnThesesMarkers = function (idList) 
{
	this.hidePartiallyAllMarkers();

	for(var i = 0; i < idList.length; i++)
	{
		var marker = this.getMarkerById(idList[i]);
		marker.showNormalHidden();
		marker.show();		
	}

};

MarkerManager.prototype.clearFocusOnThesesMarkers = function (idList) 
{
	this.showNormalHiddenAllMarkers();
	for(var i = 0; i < idList.length; i++)
	{
		this.getMarkerById(idList[i]).hide();
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

