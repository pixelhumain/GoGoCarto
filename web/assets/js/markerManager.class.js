jQuery(document).ready(function()
{	
});

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
		marker = new BiopenMarker(list[i]);
		this.markers_.push(marker); 
	}

	this.markerHome_ = new RichMarker({
		position: GLOBAL.getConstellation().getOrigin(),
	});
};

function handleMarkerClick(providerId) 
{	
	$('#detail_provider').empty();
	$('#infoProvider-'+providerId).clone().appendTo($('#detail_provider'));
	$('#detail_provider .collapsible-header').click(toggleProviderDetailsComplet);
	animate_up_bandeau_detail();
};

MarkerManager.prototype.draw = function () 
{	
	/*$('.providerItem').hide();
	var providerId;*/
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
		this.getMarkerById(idList[i]).show();
		this.getMarkerById(idList[i]).showNormalHidden();
	}
};

MarkerManager.prototype.clearFocusOnThesesMarkers = function (idList) 
{
	this.showNormalHiddenAllMarkers();
	for(var i = 0; i < idList.length; i++)
	{
		this.getMarkerById(idList[i]).hide();
	}
	this.draw();
};

MarkerManager.prototype.drawLines = function () 
{
	var i, line;

	// remove previous lines with clusters
	for (i = 0; i < this.clusterLines_.length; i++)
	{
		this.clusterLines_[i].setMap(null);
	}
	this.clusterLines_ = [];
		
/*	// draw line between stars not in cluster and origin
	for(var i = 0; i < this.stars_.length; i++)
	{
		this.stars_[i].setPolyline(null);
		
		if (!this.stars_[i].isClustered()) 
		{
			line = drawLineBetweenPoints(this.getOrigin(), this.stars_[i].getPosition(), this.stars_[i].getName())
			this.stars_[i].setPolyline(line);
		}
	}*/

	// draw lines with clusters
	if (GLOBAL.getClusterer() != null) 
	{
		var clusters = GLOBAL.getClusterer().getMinimizedClusters();
		
		for (i = 0; i < clusters.length; i++)
		{
			line = drawLineBetweenPoints(this.getOrigin(), clusters[i].getCenter(), 'cluster');
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

