jQuery(document).ready(function()
{	
	$('#constellation-zone').click(function()
	{ 
		var address = $('#inputAddress').val();
		if (!address) $('#inputAddress').addClass('invalid');
		else redirectToConstelisting('biopen_constellation', address); 
	});

	$('#listing-zone').click(function(){ redirectToConstelisting('biopen_listing',$('#inputAddress').val()); });

	$('#inputAddress').on("search", function(event, address)
	{
		redirectToConstelisting('biopen_constellation', address);
	});

});

function initMap() 
{	
	initInputAddressAutocompletion();
}