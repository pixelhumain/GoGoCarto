jQuery(document).ready(function()
{	
	$('#inputAdresse').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			redirectTo('biopen_constellation');
		}
	});

	$('#btn_constellation').click(function(){ redirectTo('biopen_constellation'); });

	$('#btn_listing').click(function(){ redirectTo('biopen_listing'); });

});

function redirectTo(route)
{
	var adresse_slug = slugify($('#inputAdresse').val());
	window.location.href = Routing.generate(route, { slug : adresse_slug});
}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function initMap() 
{	
	var options = {
	  componentRestrictions: {country: 'fr'}
	};
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputAdresse', options));
}