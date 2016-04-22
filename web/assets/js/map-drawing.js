function drawLineBetweenPoints(point1, point2, providerType = 'producteur', map_)
{
	/*var origine = latlngToPoint(point1);
	var destination = latlngToPoint(point2);

	var vecteurX = destination.x - origine.x;
	var vecteurY = destination.y - origine.y;

	var vecteurUnitaireX = vecteurX / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));
	var vecteurUnitaireY = vecteurY / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));

  	var offset = 0; // px

  	origine.x += vecteurUnitaireX * offset;
  	origine.y += vecteurUnitaireY * offset;
  	destination.x -= vecteurUnitaireX * offset;
  	destination.y -= vecteurUnitaireY * offset;

  	var LineStart = pointToLatlng(origine);
  	var LineEnd = pointToLatlng(destination);*/

  	var LineStart = point1;
  	var LineEnd = point2;

	var LineArray = [
    	{lat: LineStart.lat(), lng: LineStart.lng()},
    	{lat: LineEnd.lat(), lng: LineEnd.lng()}
  	];

  	// valeurs par default
  	var color = '#FFFFFF';
	var opacity = 0.5;
	var weight = 3;

	switch(providerType) {
	    case 'producteur':
	    case 'amap':
	        color = '#26A69A';
	        break;
	    case 'boutique':
	    case 'epicerie':
	    	color = '#0000FF';
	    	break;
	    case 'marche':
	    	color = '#444';
	    	break;
	}

	var poly = new google.maps.Polyline({
		path: LineArray,
		strokeColor: color,
		strokeOpacity: opacity,
		strokeWeight: weight
	});
	
	poly.setMap(GLOBAL.getMap());

	return poly;  		
}

/*function createMarker(position, providerId, produit)
{
	
	var parser = new DOMParser();
	var contentDom = document.createElement("div");
	contentDom.innerHTML = '<div class="marker-wrapper rotate"><img class="iconMarkerSvg rotate" src="'+ iconDirectory + 'map.svg"></img><div class="iconInsideMarker icon-'+produit+'""></div></div>' ;

	var marker = new RichMarker({
		
		map: GLOBAL.getMap(),
		draggable: false,
		position: position,
		flat: true,
		content: contentDom
	});


	marker.addListener('click', function() 
	{
		window.console.log("marker on click, id = " + providerId);
		markerOnClick(providerId);
	});

	return marker;
}*/

/*var markers;
function createMarker(provider)
{
	
	var parser = new DOMParser();
	var contentDom = document.createElement("div");
	contentDom.innerHTML = '<div class="marker-wrapper rotate"><img class="iconMarkerSvg rotate" src="'+ iconDirectory + 'map.svg"></img><div class="iconInsideMarker icon-'+provider.mainProduct+'""></div></div>' ;

	var marker = new RichMarker({		
		map: null,
		draggable: false,
		position: new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);,
		flat: true,
		content: contentDom
	});


	marker.addListener('click', function() 
	{
		window.console.log("marker on click, id = " + providerId);
		markerOnClick(providerId);
	});

	return marker;
}*/

