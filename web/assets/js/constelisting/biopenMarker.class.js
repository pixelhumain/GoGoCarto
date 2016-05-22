

function BiopenMarker(id_, position_) 
{
	var that = this;

	this.id_ = id_;

	if (!position_)
	{
		var provider = this.getProvider();
		if (provider == null) window.console.log("provider null id = "+ this.id_);
		else
		position_ = new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
	} 
	
	this.richMarker_ = new RichMarker({		
		map: null,
		draggable: false,
		position: position_,
		flat: true
	});

	this.richMarker_.checkCluster = true;
	
	google.maps.event.addListener(this.richMarker_, 'click', function(ev) 
	{
		if (GLOBAL.constellationMode())
		{
			if (that.isHalfHidden_) clearProductList();
		}		
		showProviderInfosOnMap(that.id_);
		ev.preventDefault();
		ev.stopPropagation();
		event.preventDefault();
    });

	
    google.maps.event.addListener(this.richMarker_, 'mouseover', function(ev) 
	{
		that.showBigSize();
    });

    google.maps.event.addListener(this.richMarker_, 'mouseout', function(ev) 
	{
        that.showNormalSize();
    });

	if (GLOBAL.constellationMode())
	{
		var that = this;
    	google.maps.event.addListener(this.richMarker_, 'visible_changed', function() { that.checkPolylineVisibility_(that); });
	}
	
	this.isHalfHidden_ = false;

	this.updateIcon();	
}

BiopenMarker.prototype.animateDrop = function () 
{
	$('#marker-'+this.id_).animate({bottom: '25px'}, 300, 'easeInOutCubic');
	$('#marker-'+this.id_).animate({bottom: '0px'}, 250, 'easeInOutCubic');
}

BiopenMarker.prototype.updateIcon = function () 
{		
	var main_icon;
	var provider = this.getProvider();

	if (GLOBAL.constellationMode())
	{
		var starNames = GLOBAL.getConstellation().getStarNamesRepresentedByProviderId(this.id_);
		var lineType = 'normal';
		
		if (starNames.length == 0)
		{
			main_icon = provider.mainProduct;
			lineType = "dashed";
		} 
		else if (starNames.length == 1)
		{
			main_icon = starNames[0];
		} 
		else
		{
			main_icon = 'multiple';
		}

		this.updatePolyline({lineType: lineType});
		
	}
	else
	{
		main_icon = provider.mainProduct;
	}	

	var content = document.createElement("div");
	$(content).addClass("marker-wrapper");
	$(content).addClass(provider.type);


	var innerHTML = '<div id="marker-'+this.id_+'" data-id='+this.id_+' class="rotate icon-marker"></div>';
    innerHTML += '<div class="iconInsideMarker-wrapper rotate"><div class="iconInsideMarker icon-'+main_icon+'"></div></div>'
    
    if (this.getProvider().products.length > 1)
    {
    	var product, products = provider.products;

    	var nbreMoreProduct = products.length;
    	//if (main_icon != 'multiple') nbreMoreProduct--;
    	widthMoreProduct = nbreMoreProduct*39 + 5;
    	

    	innerHTML += '<div class="icon-plus-circle rotate"></div>';
    	innerHTML += '<div class="moreIconContainer rotate" style="width:'+widthMoreProduct+'px">';
    	
	    for(var i = 0; i < products.length;i++)
		{
			product = products[i];

			if (product.nameFormate != main_icon)
			{
				innerHTML += '<div class="moreIconWrapper" >';
				innerHTML += '<span class="moreIcon iconInsideMarker icon-'+product.nameFormate+'""></span>';
		    	innerHTML += '</div>';
	    	}
	    }

		innerHTML += '</div>';
    }     
     
    innerHTML += '</div>';

    content.innerHTML = innerHTML;

  	this.richMarker_.setContent(content);	
};

BiopenMarker.prototype.addClassToRichMarker_ = function (classToAdd) 
{		
	content = this.richMarker_.getContent(); 
	$(content).addClass(classToAdd);   
};

BiopenMarker.prototype.removeClassToRichMarker_ = function (classToRemove) 
{		
	content = this.richMarker_.getContent(); 
	$(content).removeClass(classToRemove);   
};

BiopenMarker.prototype.showBigSize = function () 
{		
	
	this.addClassToRichMarker_("BigSize");
	content = this.richMarker_.getContent(); 
	$(content).find('.moreIconContainer').show();
	$(content).find('.icon-plus-circle').hide();
	
	if (!this.isHalfHidden_ && this.polyline_)
	{
		this.setPolylineOptions({
			strokeOpacity: 1,
			strokeWeight: 3
		});
	}	
};

BiopenMarker.prototype.showNormalSize = function () 
{	
	this.removeClassToRichMarker_("BigSize");
	content = this.richMarker_.getContent(); 
	$(content).find('.moreIconContainer').hide();
	$(content).find('.icon-plus-circle').show();
	
	if (!this.isHalfHidden_ && this.polyline_)
	{
		this.setPolylineOptions({
			strokeOpacity: 0.5,
			strokeWeight: 3
		});
	}	
};

BiopenMarker.prototype.setPolylineOptions = function (options)
{
	if (!this.polyline_.isDashed)
	{
		this.polyline_.setOptions(options)
	}
	else
	{
		this.updatePolyline({
			lineType : 'dashed' , 
			strokeOpacity: options.strokeOpacity,
			strokeWeight: options.strokeWeight
		});
	}
} 
	
BiopenMarker.prototype.updatePolyline = function (options) 
{
	if (!this.polyline_)
	{
		this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), '', null, options);
	}
	else
	{		
		var map = this.polyline_.getMap();
		this.polyline_.setMap(null);
		this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), '', map, options);	
	}
};

BiopenMarker.prototype.showHalfHidden = function () 
{		
	this.addClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
	$(content).css('z-index','1');
	$(content).find('.icon-plus-circle').addClass("halfHidden");
	$(content).find('.moreIconContainer').addClass("halfHidden");
	if (this.polyline_) this.setPolylineOptions({
			strokeOpacity: 0.1,
			strokeWeight: 2
	});

	this.isHalfHidden_ = true;
	this.richMarker_.checkCluster = false;
};

BiopenMarker.prototype.showNormalHidden = function () 
{		
	this.removeClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
	$(content).css('z-index','10');
	$(content).find('.icon-plus-circle').removeClass("halfHidden");
	$(content).find('.moreIconContainer').removeClass("halfHidden");
	if (this.polyline_) this.setPolylineOptions({
			strokeOpacity: 0.7,
			strokeWeight: 3
	});

		/*this.polyline_.setOptions({
		strokeOpacity: 0.5
	});*/
	this.isHalfHidden_ = false;
	this.richMarker_.checkCluster = true;
};

BiopenMarker.prototype.getId = function () 
{	
	return this.id_;
};

BiopenMarker.prototype.getRichMarker = function () 
{	
	return this.richMarker_;
};

BiopenMarker.prototype.getProvider = function () 
{	
	return GLOBAL.getProviderManager().getProviderById(this.id_);
	//return this.provider_;
};

BiopenMarker.prototype.checkPolylineVisibility_ = function (context) 
{		
	if (context.richMarker_ == null) return;
	//window.console.log("checkPolylineVisibility_ " + context.richMarker_.getVisible());
	context.polyline_.setVisible(context.richMarker_.getVisible());	
	context.polyline_.setMap(context.richMarker_.getMap());	
};

BiopenMarker.prototype.show = function () 
{	
	this.richMarker_.setMap(GLOBAL.getMap());
	this.richMarker_.setVisible(true);
	if (GLOBAL.constellationMode()) this.polyline_.setMap(GLOBAL.getMap());
};

BiopenMarker.prototype.hide = function () 
{	
	this.richMarker_.setMap(null);
	this.richMarker_.setVisible(false);
	if (GLOBAL.constellationMode()) this.polyline_.setMap(null);
};

BiopenMarker.prototype.getVisible = function () 
{	
	return this.richMarker_.getVisible();
};

BiopenMarker.prototype.setVisible = function (bool) 
{	
	this.richMarker_.setVisible(bool);
};

BiopenMarker.prototype.getPosition = function () 
{	
	return this.richMarker_.getPosition();
};

