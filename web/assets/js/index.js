jQuery(document).ready(function()
{	
	$('#btn-constellation').click(function()
	{ 
		var address = $('#inputAddress').val();
		if (!address) 
		{
			window.console.log("shake");
			$('#inputAddress').addClass('invalid');
			$('#inputAdressContainer').effect("shake", { direction: "right", times: 3, distance: 15});
		}
		else redirectToConstelisting('biopen_constellation', address); 
	});

	$('#btn-listing').click(function(){ redirectToConstelisting('biopen_listing',$('#inputAddress').val()); });

	$('#inputAddress').on("search", function(event, address)
	{
		redirectToConstelisting('biopen_listing', address);
	});
});

function initMap() 
{	
	initInputAddressAutocompletion();
}