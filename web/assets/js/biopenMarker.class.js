jQuery(document).ready(function()
{	
});

function BiopenMarker(provider) 
{
	// héritage
	/*for(key in RichMarker.prototype) 
	{   
 		BiopenMarker.prototype[key] = RichMarker.prototype[key];
	}*/
	var parser = new DOMParser();
	var contentDom = document.createElement("div");
	contentDom.innerHTML = '<div id="marker-"'+provider.id+' data-id='+provider.id+' class="marker-wrapper rotate"><img class="iconMarkerSvg rotate" src="'+ iconDirectory + 'map.svg"></img><div class="iconInsideMarker icon-'+provider.main_product+'""></div></div>' ;

	this.richMarker_ = new RichMarker({		
		map: null,
		draggable: false,
		position: new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude),
		flat: true,
		content: contentDom
	});

	var that = this;
	google.maps.event.addListener(this.richMarker_, 'click', function(ev) 
	{
        window.console.log("marker on click, id = " + provider.id);
		that.handleClick(provider.id);
		ev.preventDefault();
		ev.stopPropagation();
		event.preventDefault();
    });




	this.id_ = provider.id;
	this.mainProduct_ = provider.mainProduct;
}

BiopenMarker.prototype.handleClick = function (providerId) 
{	
	$('#detail_provider').empty();
	$('#infoProvider-'+providerId).clone().appendTo($('#detail_provider'));
	$('#detail_provider .collapsible-header').click(toggleProviderDetailsComplet);
	animate_up_bandeau_detail();
};

BiopenMarker.prototype.getId = function () 
{	
	return this.id_;
};

BiopenMarker.prototype.getRichMarker = function () 
{	
	return this.richMarker_;
};

BiopenMarker.prototype.getMainProduct = function () 
{	
	return this.mainProduct_;
};

BiopenMarker.prototype.show = function () 
{	
	this.richMarker_.setMap(GLOBAL.getMap());
};

BiopenMarker.prototype.getVisible = function () 
{	
	return this.richMarker_.getVisible();
};

BiopenMarker.prototype.setVisible = function (bool) 
{	
	this.richMarker_.setVisible(bool);
};

