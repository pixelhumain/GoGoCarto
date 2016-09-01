/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
function Constellation(constellationPhp) 
{
	this.stars_ = [];
	var star;

	//$.each(constellationPhp.stars, function( name_star, star )
	for(var name_star in constellationPhp.stars) 
	{
		star = new Star(name_star, constellationPhp.stars[name_star].providerList);
		this.stars_.push(star);
	}

	this.geocodeResult_ = constellationPhp.geocodeResult; 	
}

Constellation.prototype.getOrigin = function () 
{
	return new google.maps.LatLng(this.geocodeResult_.coordinates.latitude, this.geocodeResult_.coordinates.longitude) ;
};

Constellation.prototype.getGeocodeResult = function () 
{
	return this.geocodeResult_;
};

Constellation.prototype.getStars = function () 
{
	return this.stars_ ;
};

Constellation.prototype.getStarNamesRepresentedByProviderId = function (providerId) 
{
	var array= [];
	for(var i = 0; i < this.stars_.length; i++)
	{		
		if (this.stars_[i].getProviderId() == providerId) array.push(this.stars_[i].getName());		
	}
	return array;
};

Constellation.prototype.getStarFromName = function(name)
{
	for(var i = 0; i < this.stars_.length; i++)
	{		
		if (this.stars_[i].getName() == name) 
		{
			return this.stars_[i];
		}
	}

	return null;
};



