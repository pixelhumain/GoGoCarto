jQuery(document).ready(function()
{	
	$('#btn_menu').click(animate_up_bandeau_options);
	$('#overlay').click(animate_down_bandeau_options);

	ajuster_taille_composants();
	window.onresize = function() 
	{
		ajuster_taille_composants();
	}

	$('#inputAdresse').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 
			geocodeAddress($('#inputAdresse').val());
		}
	});

	/*var out = '';
    for (var i in listFournisseur) {
        out += i + ": " + i.nom + "\n";
    }

    alert(out);*/
});

var map;
var geocoder;
var marker;
var geocoding_ok;
// Google map initialisation
function initMap() 
{	
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	var image = {
	    url: 'img/icon/maison.png',
	    // This marker is 20 pixels wide by 32 pixels high.
	    size: new google.maps.Size(48, 48),
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(24, 48)
	};
	marker = new google.maps.Marker({
		map: map,
		draggable: false,
		/*icon: image,*/
		animation: google.maps.Animation.DROP,
	});

	marker.addListener('click', function() {
	    animate_up_bandeau_detail();
  	});

  	map.addListener('click', function() {
    	animate_down_bandeau_detail();
  });

}

// trouve le lat lng correspondant à une adresse donnée
function geocodeAddress( address ) {

	geocoder.geocode( { 'address': address}, function(results, status) {

	if (status == google.maps.GeocoderStatus.OK) 
	{
		map.panTo(results[0].geometry.location);
		map.setZoom(16);
		marker.setPosition(results[0].geometry.location);

		animate_from_search_to_result();		
	} 
	else 
	{
		geocoding_ok = false;
		$('#inputAdresse').addClass('invalid');	
	}
	});
}

function ajuster_taille_composants()
{
	$("#map").css('height',$( window ).height()-$('header').height()-$('#bandeau_detail').height());
	$("#bandeau_option").css('height',$( window ).height()-$('header').height());
}

function animate_from_search_to_result()
{
	var padding = (parseInt($('#div_recherche').css('margin-left').split('px')[0]) - parseInt($('#btn_menu').css('left').split('px')[0]) )  * 2 + 'px';
			
	$('#inputAdresse').css('display','none');
	$('#div_recherche_contener').css('padding-right',padding);
	$('#div_recherche').css('width',$('#btn_menu').css('width'));

	$('#div_recherche_contener').css('width',$('#btn_menu').css('width'));
	$('#div_recherche_contener').css('left',$('#btn_menu').css('left'));

	$('#div_recherche_contener').css('height',$('#section_carte').css('height'));
	$('#div_recherche').css('height',$('#btn_menu').css('height'));			
	$('#div_recherche_contener').css('height',$('#div_recherche').css('height'));			
	$('#div_recherche_contener').css('top',$('#btn_menu').css('top'));	

	setTimeout(function () {
		$('#btn_menu').css('opacity','1');
		$('#div_recherche_contener').css('opacity','0');	
	}, 1000);

	setTimeout(function () {
		$('#div_recherche_contener').css('display','none');	
		
		$('#btn_menu').css('background-color','#26A69A');
		setTimeout(function () {
			$('#btn_menu').css('background-color','white');			
		}, 500);				
	}, 1500);
}

function animate_up_bandeau_detail()
{
	$('#bandeau_detail').css('height','200px');
	$("#map").css('height',$( window ).height()-$('header').height()-200);		
}

function animate_down_bandeau_detail()
{
	$('#bandeau_detail').css('height','0px');
	$("#map").css('height',$( window ).height()-$('header').height());
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

