jQuery(document).ready(function()
{	
	$('#inputAddress').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleSearchAction();
		}
	});
	$('#inputAddress-icon').click(function()
	{		
		handleSearchAction();
	});	
	$('#inputAddress').on("place_changed", handleSearchAction);
});

function handleSearchAction()
{
	var inputAddress = $('#inputAddress');
	if (inputAddress.val())	inputAddress.trigger("search", [ inputAddress.val() ]);
}