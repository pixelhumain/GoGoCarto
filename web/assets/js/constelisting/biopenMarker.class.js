function BiopenMarker(id_, position_) 
{
	var that = this;

	this.id_ = id_;
	this.isAnimating_ = false;

	if (!position_)
	{
		var provider = this.getProvider();
		if (provider === null) window.console.log("provider null id = "+ this.id_);
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
		ev.preventDefault();
		ev.stopPropagation();

		if (GLOBAL.constellationMode())
		{
			if (that.isHalfHidden_) clearProductList();
		}		
		showProviderInfosOnMap(that.id_);

		if (GLOBAL.getState() == 'starRepresentationChoice')
		{
			GLOBAL.getSRCManager().selectProviderById(that.id_);
		}
		
		//event.preventDefault();
    });

	
    google.maps.event.addListener(this.richMarker_, 'mouseover', function(ev) 
	{
		if (that.isAnimating_) { return; }
		if (!that.isHalfHidden_) that.showBigSize();
    });

    google.maps.event.addListener(this.richMarker_, 'mouseout', function(ev) 
	{
        if (that.isAnimating_) { return; }
        that.showNormalSize();
    });

	if (GLOBAL.constellationMode())
	{
    	google.maps.event.addListener(this.richMarker_, 'visible_changed', function() { that.checkPolylineVisibility_(that); });
	}
	
	this.isHalfHidden_ = false;	

	this.updateIcon();	
}

BiopenMarker.prototype.animateDrop = function () 
{
	content = this.richMarker_.getContent(); 
	this.isAnimating_ = true;
	var that = this;
	$(content).animate({top: '-=25px'}, 300, 'easeInOutCubic');
	$(content).animate({top: '+=25px'}, 250, 'easeInOutCubic', function(){that.isAnimating_ = false;});
};

BiopenMarker.prototype.updateIcon = function () 
{		
	var provider = this.getProvider();

	if (GLOBAL.constellationMode())
	{
		// POLYLINE TYPE
		var lineType;
		if (provider.starChoiceForRepresentation === '')
		{
			lineType = 'normal';
		}
		else
		{			
			lineType = provider.isCurrentStarChoiceRepresentant() ? 'normal' : 'dashed';
		}		

		this.updatePolyline({lineType: lineType});
	}

	var productsToDisplay = provider.getProductsNameToDisplay();

	var content = document.createElement("div");
	$(content).addClass("marker-wrapper");
	$(content).addClass(provider.type);
	$(content).attr('id',"marker-"+this.id_);

	var disableMarker = false;
	// en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
	if (provider.starChoiceForRepresentation !== '') 
		disableMarker = !provider.isCurrentStarChoiceRepresentant();

	if (disableMarker) $(content).addClass("disabled");

	var disableMainIcon = productsToDisplay.main.disabled ? 'disabled' : '';	

	var innerHTML = '<div class="rotate animate icon-marker"></div>';
    innerHTML += '<div class="iconInsideMarker-wrapper rotate"><div class="iconInsideMarker '+disableMainIcon+' icon-'+productsToDisplay.main.value+'"></div></div>';
    
    var widthMoreProduct, nbreOthersProducts = productsToDisplay.others.length;

    var showMoreIcon = true;
    if (GLOBAL.constellationMode()) showMoreIcon = provider.isProducteurOrAmap();

    if (nbreOthersProducts > 0 && showMoreIcon)
    {
    	widthMoreProduct = nbreOthersProducts*39 + 5;    	

    	innerHTML += '<div class="icon-plus-circle animate rotate"></div>';
    	innerHTML += '<div class="moreIconContainer animate rotate" style="width:'+widthMoreProduct+'px">';
    	
    	var productName, disableProduct;

	    for(var i = 0; i < nbreOthersProducts;i++)
		{
			productName = productsToDisplay.others[i].value;
			disableProduct = productsToDisplay.others[i].disabled ? 'disabled' : '';
			innerHTML += '<div class="moreIconWrapper '+disableProduct+'" >';
			innerHTML += '<span class="moreIcon iconInsideMarker '+disableProduct+' icon-'+productName+'"></span>';
	    	innerHTML += '</div>';
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
		this.polyline_.setOptions(options);
	}
	else
	{
		this.updatePolyline({
			lineType : 'dashed' , 
			strokeOpacity: options.strokeOpacity,
			strokeWeight: options.strokeWeight
		});
	}
};
	
BiopenMarker.prototype.updatePolyline = function (options) 
{
	if (!this.polyline_)
	{
		this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), this.getProvider().type, null, options);
	}
	else
	{		
		var map = this.polyline_.getMap();
		this.polyline_.setMap(null);
		this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), this.getProvider().type, map, options);	
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
	if (context.richMarker_ === null) return;
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

