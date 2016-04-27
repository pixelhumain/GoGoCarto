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
	contentDom.innerHTML = '<div id="marker-'+provider.id+'" data-id='+provider.id+' class="marker-wrapper rotate"><img class="iconMarkerSvg rotate" src="'+ iconDirectory + 'map.svg"></img><div class="iconInsideMarker icon-'+provider.main_product+'""></div></div>' ;

	this.richMarker_ = new RichMarker({		
		map: null,
		draggable: false,
		position: new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude),
		flat: true,
		content: contentDom
	});

	this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), '', null)

	var that = this;
	google.maps.event.addListener(this.richMarker_, 'click', function(ev) 
	{
        //window.console.log("marker on click, id = " + provider.id);
		that.handleClick(provider.id);
		ev.preventDefault();
		ev.stopPropagation();
		event.preventDefault();
    });

    google.maps.event.addListener(this.richMarker_, 'visible_changed', this.checkPolylineVisibility_);

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

BiopenMarker.prototype.addClassToRichMarker_ = function (classToAdd) 
{		
	content = this.richMarker_.getContent(); 
	$(content).find(".marker-wrapper").addClass(classToAdd);   
};

BiopenMarker.prototype.removeClassToRichMarker_ = function (classToRemove) 
{		
	content = this.richMarker_.getContent(); 
	$(content).find(".marker-wrapper").removeClass(classToRemove);   
};

BiopenMarker.prototype.showBigSize = function () 
{		
	this.addClassToRichMarker_("BigSize");
	this.polyline_.setOptions({
		strokeOpacity: 1,
		strokeWeight: 3
	});
};

BiopenMarker.prototype.showNormalSize = function () 
{	
	this.removeClassToRichMarker_("BigSize");
	this.polyline_.setOptions({
		strokeOpacity: 0.5,
		strokeWeight: 3
	});
};

BiopenMarker.prototype.showHalfHidden = function () 
{		
	this.addClassToRichMarker_("halfHidden");
	this.polyline_.setOptions({
		strokeOpacity: 0.2,
	});
};

BiopenMarker.prototype.showNormalHidden = function () 
{		
	this.removeClassToRichMarker_("halfHidden");
	this.polyline_.setOptions({
		strokeOpacity: 0.5
	});
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

BiopenMarker.prototype.checkPolylineVisibility_ = function () 
{	
	if (this.richMarker_ == null) return;
	this.polyline_.setVisible(this.richMarker_.getVisible());	
};

BiopenMarker.prototype.show = function () 
{	
	this.richMarker_.setMap(GLOBAL.getMap());
	this.polyline_.setMap(GLOBAL.getMap());
};

BiopenMarker.prototype.hide = function () 
{	
	this.richMarker_.setMap(null);
	this.polyline_.setMap(null);
};

BiopenMarker.prototype.getVisible = function () 
{	
	return this.richMarker_.getVisible();
};

BiopenMarker.prototype.setVisible = function (bool) 
{	
	this.richMarker_.setVisible(bool);
};

