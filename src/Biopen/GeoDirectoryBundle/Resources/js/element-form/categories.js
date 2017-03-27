/*
* @Author: Sebastian Castro
* @Date:   2017-03-27 16:26:49
* @Last Modified by:   Sebastian Castro
* @Last Modified time: 2017-03-27 20:22:40
*/
var index = 1;
jQuery(document).ready(function()
{	
	$('.category-select').material_select();

	$(".category-select").change(function() 
	{ 
		if (!$(this).val()) return;

		$(this).parents('.category-field').removeClass('error');

		//console.log("Select option", $(this).val());
		var optionField = $('#option-field-' + $(this).val());
		optionField.stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
		optionField.attr('data-index', index);
		optionField.css('-webkit-box-ordinal-group', index);
		optionField.css('-moz-box-ordinal-group', index);
		optionField.css('-ms-flex-order', index);
		optionField.css('-webkit-order', index);
		optionField.css('order', index);

		checkForSelectLabel(optionField, 1);

		index++;
	});

	$('.option-field-delete').click(function()
	{
		var optionFieldToRemove = $('#option-field-' + $(this).attr('data-id'));

		if (optionFieldToRemove.hasClass('inline')) 
			optionFieldToRemove.hide();
		else
			optionFieldToRemove.stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});

		checkForSelectLabel(optionFieldToRemove, 0);
	});

	function checkForSelectLabel(optionField, increment)
	{
		
		var categorySelect = optionField.siblings('.category-field-select');
		
		console.log("select", categorySelect.attr('data-picking-text'));

		var select = categorySelect.find('input.select-dropdown');

		if (optionField.siblings('.option-field:visible').length + increment === 0)
			select.val("Choississez " + categorySelect.attr('data-picking-text'));
		else
			select.val("Ajoutez " + categorySelect.attr('data-picking-text'));
	}
});