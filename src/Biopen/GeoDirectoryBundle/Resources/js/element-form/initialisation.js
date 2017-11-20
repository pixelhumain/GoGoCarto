/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-11-20 10:35:33
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

	$('.tooltipped').tooltip();

	// ---------------
	// AJOUT LISTENERS
	// ---------------

  var inputDescription = $('#input-description');
  var inputDescriptionMore = $('#input-description-more');
  console.log(inputDescriptionMore.val().length);
  if (inputDescriptionMore.val().length > 0) inputDescriptionMore.parent('.input-field').show();

  inputDescription.on('input', function() {
    if ($(this).hasClass('invalid')) inputDescriptionMore.parent('.input-field').slideDown(800);
    else if (inputDescriptionMore.val().length == 0) inputDescriptionMore.parent('.input-field').slideUp(500);
  })

	// entrée d'une adresse on geocode
	$('#input-address').change(function () { handleInputAdressChange(); });
	$('#input-address').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleInputAdressChange();
		}
	});
	$('.btn-geolocalize').click(function () { handleInputAdressChange(); });
	
	// quand on check un product l'input de pr?cision apparait ou disparait
	$('.checkbox-products').click(function() { return !$(this).hasClass('readonly'); });
	$('.checkbox-products').change(function()
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
	$('.add-time-slot-button').click(function() { addTimeSlot($(this).attr('id').split("_")[0]); });
  $('.clear-time-slot-button').click(function() { clearTimeSlot($(this).attr('id').split("_")[0]); });
	// copie des openHours du day pr?c?dent
	$('.redo-time-slot-button').click(function() { redoTimeSlot($(this).attr('id').split("_")[0]); });


});

function handleInputAdressChange()
{
	geocodeAddress($('#input-address').val());
}

