function ajout_plage_horaire( jour )
{
	$('#' + jour + '_horaire_2').addClass('active');	
	$('#' + jour + '_ajout').css('visibility','hidden');
}

function clear_plage_horaire( jour )
{
	$('#' + jour + '_ajout').css('visibility','visible');
	$('#' + jour + '_horaire_2').removeClass('active');
	$('#' + jour + '_input_3').val(null);
	$('#' + jour + '_input_4').val(null);
}

function redo_plage_horaire( jour )
{
	var jour_to_copy = jour - 1;

	$('#' + jour + '_input_1').val($('#' + jour_to_copy + '_input_1').val());
	$('#' + jour + '_input_2').val($('#' + jour_to_copy + '_input_2').val());
	$('#' + jour + '_input_3').val($('#' + jour_to_copy + '_input_3').val());
	$('#' + jour + '_input_4').val($('#' + jour_to_copy + '_input_4').val());

	// si on recopie une plage horaire bonus, on doit la montrer visible
	if ( $('#' + jour + '_input_3').val() || $('#' + jour + '_input_4').val())
	{
		ajout_plage_horaire(jour);
	}		
}