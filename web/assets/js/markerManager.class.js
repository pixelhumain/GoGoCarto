jQuery(document).ready(function()
{	
});

function MarkerManager() 
{
	this.markers_= [];
	this.markerHome_ = null;	
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

	$('.marker-wrapper').click(function ()
	{
		window.console.log("marker click depuis wrapper id = " + $(this).attr("data-id"));
		handleMarkerClick($(this).attr("data-id"));
	})

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

MarkerManager.prototype.getMarkers = function () 
{
	var array = [];
	for(var i = 0; i < this.markers_.length; i++)
	{
		array.push(this.markers_[i].getRichMarker());
	}
	return array;
};

MarkerManager.prototype.getMarkersIncludingHome = function () 
{
	var array = [];
	array.push(this.markerHome_);
	array = array.concat(this.getMarkers());
	return array;
};

MarkerManager.prototype.getMarkerHome = function () 
{
	return this.markerHome_ ;
};

