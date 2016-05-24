var old_zoom;

function initMap() 
{	
	initRichMarker();

	if (constellationMode)
	{
		// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		var mapOptions = {
			zoom: 6,
			center: latlng,
			disableDefaultUI: true,
			zoomControl: true
		};
	
	}	
	else
	{
		var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		var mapOptions = {
			zoom: 10,
			center: center,
			disableDefaultUI: true,
			zoomControl: true
		};
	}

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	zoom = map.getZoom();		

	google.maps.event.addListener(map, 'projection_changed', function () 
	{    			
		initialize(map);
	} );

	map.addListener('click', function(e) 
	{
    	if (constellationMode) clearProductList();
    	animate_down_bandeau_detail();     	
    	//addMarkerForTest(e);
  	}); 
}

function initialize(map)
{
	if (constellationMode)
	{
		var constellation = new Constellation(constellationRawJson);	
		var providerManager = new ProviderManager(providerListJson);
		var markerManager = new MarkerManager();	
		GLOBAL = new Global(map, constellation, providerManager, markerManager, constellationMode);

		GLOBAL.getMarkerManager().createMarkers();
		GLOBAL.getMarkerManager().draw();
		GLOBAL.getProviderManager().draw();
		
		GLOBAL.getMarkerManager().fitMapInBounds();
		
		initCluster(GLOBAL.getMarkerManager().getMarkers());
		GLOBAL.getClusterer().addListener('clusteringend', function() { GLOBAL.getMarkerManager().drawLinesWithClusters(); });
	}
	else
	{
		var constellation = null;	
		var providerManager = new ProviderManager(providerListJson);
		var markerManager = null;	
		GLOBAL = new Global(map, constellation, providerManager, markerManager, constellationMode);

		initCluster(null);
		providerManager.updateProviderList();

		map.addListener('idle', function(e) 
		{
	    	var updateInAllProviderList = true;
	    	var forceRepaint = false;

	    	if (map.getZoom() != old_zoom)  
	    	{
	    		if (map.getZoom() > old_zoom) updateInAllProviderList = false;
	    		old_zoom = map.getZoom();
	    		forceRepaint = true;
	    	}
	    	providerManager.updateProviderList(updateInAllProviderList, forceRepaint);	 
	  	}); 
	}
	
}

function initCluster(markersToCluster)
{
	// Set Options
	var clusterOptions = {
	    title: 'Cluster Title',
	    enableRetinaIcons: true,
	    /*styles: styles,
	    calculator: calculator,*/
	    gridSize: 40, 
	    maxZoom: 17,
	    automaticRepaint: GLOBAL.constellationMode(),
	}

    var cluster = new MarkerClusterer(GLOBAL.getMap(), markersToCluster, clusterOptions);
    GLOBAL.setClusterer(cluster);

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });
}

function showProviderInfosOnMap(providerId, showMoreChoiceInfo = true) 
{	
	if (constellationMode)
	{
		// durty method to know if we are in large screen
		if ($('#ProviderList').offset().top < 100)
		{			
			$('.providerItem .moreDetails').hide();
			$('.providerItem .moreChoiceInfo').remove();
			var target = $('#infoProvider-'+providerId);
		    $('#ProviderList').animate({scrollTop: '+='+$(target).position().top}, 500);
		    $('#infoProvider-'+providerId + ' .moreDetails').slideDown(slideOptions);
		}
		else
		{
			$('#detail_provider').empty();
			$('#infoProvider-'+providerId).clone().appendTo( "#detail_provider").show();
			$('#infoProvider-'+providerId + ' .moreChoiceInfo').remove();
		}	

		if (GLOBAL.getState() == 'starRepresentationChoice' 
			&& !$('#infoProvider-'+providerId + ' .moreChoiceInfo').is(':visible')
			&& showMoreChoiceInfo)
		{
			
			var starMoreChoicesVisible = $('.moreResultContainer:visible').first();
			var starName = starMoreChoicesVisible.parent().find('.productItem').attr('data-star-name');
			var star = GLOBAL.getConstellation().getStarFromName(starName);
			var providerIndex = star.getProviderIndexFromId(providerId);
			
			var content = document.createElement("div");
			$(content).attr('data-star-name',starName);
			$(content).attr('data-provider-index',providerIndex);
			$(content).addClass("moreChoiceInfo");
			$(content).html('Vous pouvez sélectionner ce fournisseur en tant que "'+starName+'" principal <button class="btn waves-effect waves-light" >Sélectionner</button> ');
			
			$(content).click(handleClickChooseProviderForStar);

			$(content).prependTo('#detail_provider');
		}
	}
	else
	{
		var provider = GLOBAL.getProviderManager().getProviderById(providerId);
		$('#detail_provider').html(provider.getHtmlRepresentation());
	}	
	
	$('#detail_provider .collapsible-header').click(toggleProviderDetailsComplet);
	animate_up_bandeau_detail();
};

function toggleProviderDetailsComplet()
{	
	if ($('#detail_provider').hasClass('floatRight')) return;
	if ( $('#bandeau_detail .moreDetails').is(':visible') )
	{
		hideProviderDetailsComplet();
	}
	else
	{
		var bandeau_detail_new_height = $( window ).height()
		-$('header').height()
		-$('#bandeau_goToProviderList').outerHeight(true);

		$('#bandeau_detail').css('height', bandeau_detail_new_height);
		ajuster_taille_carte(bandeau_detail_new_height);	

		$("#btn_menu").hide();
		$('#bandeau_detail .moreDetails').show();
	}	
}

function hideProviderDetailsComplet()
{
	setTimeout(function(){$("#btn_menu").show();},1000);
	$('#bandeau_detail .moreDetails').hide();

	var bandeau_detail_new_height = $('#detail_provider').height();

	$('#bandeau_detail').css('height', bandeau_detail_new_height);
	ajuster_taille_carte(bandeau_detail_new_height);	
}

function animate_up_bandeau_detail()
{
	var bandeau_detail_new_height = $('#detail_provider').height();

	$('#bandeau_detail').css('height', bandeau_detail_new_height);
	ajuster_taille_carte(bandeau_detail_new_height);	
	
}

function animate_down_bandeau_detail()
{
	if ($('#detail_provider').hasClass('floatRight'))
	{
	}
	else
	{
		hideProviderDetailsComplet();
		$('#bandeau_detail').css('height','0');
		ajuster_taille_carte(0);	
	}
}








