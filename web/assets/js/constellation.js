// créer un evenement déclenché à la modification du style d'un evenement
(function() {
    var ev = new $.Event('style'),
        orig = $.fn.css;
    $.fn.css = function() {
        $(this).trigger(ev);
        return orig.apply(this, arguments);
    }
})();

jQuery(document).ready(function()
{	
	$('.collapsible').collapsible({
      accordion : true 
    });

	$('#bandeau_detail').bind('style', ajuster_taille_carte);
    $('#detail_fournisseur .collapsible-header').click(toggleFournisseurDetailsComplet);


    $('a[href^="#"]').click(function(){  
	    var target = $(this).attr("href");
	    $('html, body').animate({scrollTop: $(target).offset().top}, 2000);
	    return false;  
	}); 

	$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);

	ajuster_taille_composants();
	window.onresize = function() 
	{
		ajuster_taille_composants();
	}	
});

var map;
var marker_home, markers;

// Google map initialisation
function initMap() 
{	
	var options = {
	  componentRestrictions: {country: 'fr'}
	};
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputAdresse', options));

	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}

	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	// une fois la carte chargée, si la constellation existe on la dessine
  	if (constellation != null)	drawConstellation();

}

function getMarkerPosition(marker)
{
	var scale = Math.pow(2, map.getZoom());
	var nw = new google.maps.LatLng(
	    map.getBounds().getNorthEast().lat(),
	    map.getBounds().getSouthWest().lng()
	);
	var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
	var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
	var pixelOffset = new google.maps.Point(
	    Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
	    Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
	);

	return pixelOffset;
}

function drawConstellation()
{	
	markers = [];

	var image = {
	    url: 'img/icon/maison.png',
	    // This marker is 20 pixels wide by 32 pixels high.
	    size: new google.maps.Size(48, 48),
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(24, 48)
	};

	marker_home = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(constellation.geocodeResult.coordinates.latitude, constellation.geocodeResult.coordinates.longitude),
		draggable: false,
		/*icon: image,*/
		animation: google.maps.Animation.DROP,
	});	

	markers.push(marker_home);

  	map.addListener('click', function() {
    	animate_down_bandeau_detail();
  	}); 

	map.panTo(marker_home.getPosition());
	map.setZoom(16);

	$.each(constellation.etoiles, function( nom_etoile, etoile ) 
	{
  		var fournisseur = etoile.fournisseurList[etoile.index];

  		var marker = new google.maps.Marker({
			map: map,
			draggable: false,
			position: new google.maps.LatLng(fournisseur.latlng.latitude, fournisseur.latlng.longitude),
		});

		marker.addListener('click', function() {
	    	//$('#bandeau_detail').text(fournisseur.nom);
	    	animate_up_bandeau_detail();
  		});

  		var polyline = drawLineBetweenMarkers(marker_home, marker);

  		etoile['marker'] = marker;
  		etoile['line'] = polyline;

		markers.push(marker);

	});

	fitMarkersBounds();
	
	
}

function fitMarkersBounds()
{
	// Bound la carte pour que l'on voit tous les marqueurs
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
 		bounds.extend(markers[i].getPosition());
	}
	map.fitBounds(bounds);
}

function drawLineBetweenMarkers(marker1, marker2)
{
	var ratio = 1/10;

	var LineStartLat = marker1.getPosition().lat() + (marker2.getPosition().lat() - marker1.getPosition().lat())*ratio;
	var LineStartLng = marker1.getPosition().lng() + (marker2.getPosition().lng() - marker1.getPosition().lng())*ratio;
	var LineEndLat = marker1.getPosition().lat() + (marker2.getPosition().lat() - marker1.getPosition().lat())*(1-ratio);
	var LineEndLng = marker1.getPosition().lng() + (marker2.getPosition().lng() - marker1.getPosition().lng())*(1-ratio);

	var LineArray = [
    	{lat: LineStartLat, lng: LineStartLng},
    	{lat: LineEndLat, lng: LineEndLng}
  	];

	var poly = new google.maps.Polyline({
		path: LineArray,
		strokeColor: '#000000',
		strokeOpacity: 0.5,
		strokeWeight: 3,
	});
	
	poly.setMap(map);

	return poly;  		
}

function toggleFournisseurDetailsComplet()
{	
	if ( $('#bandeau_detail .moreDetails').is(':visible') )
	{
		hideFournisseurDetailsComplet();
	}
	else
	{
		var bandeau_detail_new_height = $( window ).height()
		-$('header').height()
		-$('#bandeau_plus_resultats').outerHeight(true);

		$('#bandeau_detail').css('height', bandeau_detail_new_height);
		ajuster_taille_carte(bandeau_detail_new_height);	

		$("#btn_menu").hide();
		$('#bandeau_detail .moreDetails').show();
	}
	
}

function hideFournisseurDetailsComplet()
{
	setTimeout(function(){$("#btn_menu").show();},1000);
	$('#bandeau_detail .moreDetails').hide();

	var bandeau_detail_new_height = $('#detail_fournisseur').height();

	$('#bandeau_detail').css('height', bandeau_detail_new_height);
	ajuster_taille_carte(bandeau_detail_new_height);	
}


function ajuster_taille_composants()
{	
	$("#bandeau_option").css('height',$( window ).height()-$('header').height());
	ajuster_taille_carte();
}

function ajuster_taille_carte(bandeau_detail_height = $('#bandeau_detail').height())
{	
	$("#map").css('height',$( window ).height()
		-$('header').height()
		-$('#bandeau_plus_resultats').outerHeight(true)
		-bandeau_detail_height);
}

function animate_up_bandeau_detail()
{
	var bandeau_detail_new_height = $('#detail_fournisseur').height();

	$('#bandeau_detail').css('height', bandeau_detail_new_height);
	ajuster_taille_carte(bandeau_detail_new_height);	
}

function animate_down_bandeau_detail()
{
	hideFournisseurDetailsComplet();
	$('#bandeau_detail').css('height','0');
	ajuster_taille_carte(0);	
}

function animate_up_bandeau_options()
{
	$('#overlay').css('z-index','15');
	$('#overlay').css('opacity','1');
	$("#bandeau_option").css('left','0');
}

function animate_down_bandeau_options()
{
	$('#overlay').css('z-index','-1');
	$('#overlay').css('opacity','0');
	$("#bandeau_option").css('left','-200px');
}

