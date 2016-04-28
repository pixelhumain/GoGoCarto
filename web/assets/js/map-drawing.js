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
  	var color = '#AE3536';
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
	
	poly.setMap(map_);

	return poly;  		
}

