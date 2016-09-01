/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
jQuery(document).ready(function()
{	
	// ---------------
	// INITIALISATIONS
	// ---------------
	$('.timepicker_1').timepicki({start_time: ["9", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_2').timepicki({start_time: ["12", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_3').timepicki({start_time: ["14", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_4').timepicki({start_time: ["18", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	
	// EDIT MODE
	if ($('#type_provider').val() > 0)
	{
		maj_form_with_type(false);
		maj_with_main_product($("#mainProductSelection").val());
	}

	// CHECK si un type de provider est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.type) 
	{
		$('#type_provider > option[value="'+GET.type+'"]').prop('selected',true);
		maj_form_with_type(false);
	}	
	
	$('select').material_select();

	$('.tooltipped').tooltip();

	// ---------------
	// AJOUT LISTENERS
	// ---------------
	$('#type_provider').change( maj_form_with_type );
	$("#mainProductSelection").change(function() { maj_with_main_product($(this).val()); });

	// entrée d'une adresse on geocode
	$('#inputAdresse').change(function () { handleInputAdressChange(); });
	$('#inputAdresse').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleInputAdressChange();
		}
	});
	$('#inputAddress').on("place_changed",handleInputAdressChange);

	// quand on check un product l'input de pr?cision apparait ou disparait
	$('.checkbox_products').click(function() { return !$(this).hasClass('readonly'); });
	$('.checkbox_products').change(function()
	{
        if ($(this).is(':checked')) 
        {
            $('#div_precision_' + $(this).attr('value')).css('display','block');	
    	}
        else
        {
        	$('#div_precision_' + $(this).attr('value')).css('display','none');	
        }
    });    

	// HORAIRES
	// gestion d'une seconde plage horaire pour les petits ?crans
	$('.ajout_plage_horaire').click(function() { ajout_plage_horaire($(this).attr('id').split("_")[0]); });
    $('.clear_plage_horaire').click(function() { clear_plage_horaire($(this).attr('id').split("_")[0]); });
	// copie des horaires du jour pr?c?dent
	$('.redo_plage_horaire').click(function() { redo_plage_horaire($(this).attr('id').split("_")[0]); });


});

function handleInputAdressChange()
{
	geocodeAddress($('#inputAdresse').val());
}

