function drawLineBetweenPoints(point1, point2, providerType = 'producteur', map_, options)
{
/*	var origine = latlngToPoint(point1);
	var destination = latlngToPoint(point2);

	var vecteurX = destination.x - origine.x;
	var vecteurY = destination.y - origine.y;

	var vecteurUnitaireX = vecteurX / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));
	var vecteurUnitaireY = vecteurY / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));

  	var offset = 20; // px

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

  	var options = options || {};
  	// valeurs par default
  	options.lineType = options.lineType || 'normal';
  	options.strokeOpacity = options.strokeOpacity || 0.5;
  	options.strokeWeight = options.strokeWeight || 3;


  	var color = '#AE3536';

	switch(providerType) 
	{
	    case 'producteur': color = '#B33536'; break;
	    case 'amap': color = '#4B7975'; break;
	    case 'boutique': color = '#813c81'; break;
	    case 'marche': color = '#3F51B5'; break;
	    case 'epicerie': color = '#6d6d6d'; break;
	}

	if (options.lineType == 'dashed')
	{
		// Create the polyline, passing the symbol in the 'icons' property.
		// Give the line an opacity of 0.
		// Repeat the symbol at intervals of 20 pixels to create the dashed effect.
		var poly = new google.maps.Polyline({
			path: LineArray,
			strokeOpacity: 0,
			icons: [{
			  icon: {
			    path: 'M 0,-1 0,1',
			    strokeOpacity: options.strokeOpacity,
			    strokeWeight: options.strokeWeight,
			    strokeColor: color,
			    scale: 4
			  },
			  offset: '0',
			  repeat: '20px'
			}],
		});
		poly.isDashed = true;
	}
	else
	{
		var poly = new google.maps.Polyline({
			path: LineArray,
			strokeColor: color,
			strokeOpacity: options.strokeOpacity,
			strokeWeight: options.strokeWeight,
		});

		poly.isDashed = false;
	}

	poly.setMap(map_);

	return poly;  		
}


