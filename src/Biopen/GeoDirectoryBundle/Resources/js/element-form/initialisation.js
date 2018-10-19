/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-02-20 17:36:33
 */
jQuery(document).ready(function()
{	
  $('select').material_select();

  // TIMEPICKERS
  $('.timepicker').each(function(e) {
    var start_time;
    switch ($(this).data('slot-number'))
    {
      case 1: start_time = ["09", "00"];break;
      case 2: start_time = ["12", "00"];break;
      case 3: start_time = ["14", "00"];break;
      case 4: start_time = ["18", "00"];break;
    }
    if ($(this).val()) { start_time = $(this).val().split(':'); }
    $(this).timepicki({start_time: start_time, increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:0, max_hour_value:23, overflow_minutes:true}); 
  });

	$('.tooltipped').tooltip();

	// ---------------
	// LISTENERS
	// ---------------
  
  // add description more field if description is too long
  var inputDescription = $('#input-description');
  var inputDescriptionMore = $('#input-description-more');
  
  if (inputDescriptionMore.val() && inputDescriptionMore.val().length > 0) inputDescriptionMore.parent('.input-field').show();

  inputDescription.on('input', function() {
    if ($(this).hasClass('invalid')) inputDescriptionMore.parent('.input-field').slideDown(800);
  });
	
	// OPEN HOURS
	// 2nd time slot
	$('.add-time-slot-button').click(function() { addTimeSlot($(this).attr('id').split("_")[0]); });
  $('.clear-time-slot-button').click(function() { clearTimeSlot($(this).attr('id').split("_")[0]); });
	// recopy info
	$('.redo-time-slot-button').click(function() { redoTimeSlot($(this).attr('id').split("_")[0]); });
});



