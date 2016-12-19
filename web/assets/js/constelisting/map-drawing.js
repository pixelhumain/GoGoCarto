/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function drawLineBetweenPoints(point1, point2, elementType, map_, options)
{
  	var LineStart = point1;
  	var LineEnd = point2;

	var LineArray = [
    	{lat: LineStart.lat(), lng: LineStart.lng()},
    	{lat: LineEnd.lat(), lng: LineEnd.lng()}
  	];

  	options = options || {};
  	// valeurs par default
  	options.lineType = options.lineType || 'normal';
  	options.strokeOpacity = options.strokeOpacity || 0.5;
  	options.strokeWeight = options.strokeWeight || 3;

  	var color = '#AE3536';

	switch(elementType) 
	{
	    case 'producteur': color = '#B33536'; break;
	    case 'amap': color = '#4B7975'; break;
	    case 'boutique': color = '#813c81'; break;
	    case 'marche': color = '#3F51B5'; break;
	    case 'epicerie': color = '#383D5A'; break;
	}

	var poly;

	if (options.lineType == 'dashed')
	{
		poly = new google.maps.Polyline({
			path: LineArray,
			strokeOpacity: 0,
			icons: [{
			  icon: {
			    path: 'M 0,-1 0,1',
			    strokeOpacity: options.strokeOpacity,
			    strokeWeight: options.strokeWeight,
			    strokeColor: '#777',
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
		poly = new google.maps.Polyline({
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


