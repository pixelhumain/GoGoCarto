/*
* @Author: Sebastian Castro
* @Date:   2017-03-27 16:26:49
* @Last Modified by:   Sebastian Castro
* @Last Modified time: 2018-07-08 17:24:00
*/
var index = 1;
jQuery(document).ready(function()
{	
	$('.category-select').material_select();

	$(".category-select").change(function()
	{ 
		if (!$(this).val()) return;

		$(this).parents('.category-field').removeClass('error');

		// if only single option, removing all others options laready selected
		if ($(this).data('single-option'))
		{
			$(this).closest('.category-field').find('> .option-field:visible').each(function() { removeOptionField($(this)); });
		}
		
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

		// open automatically mandatory sub select
		var firstMandatorySubSelect = optionField.find('.category-field.mandatory .select-dropdown')[0];
		if (firstMandatorySubSelect) setTimeout(function() { firstMandatorySubSelect.click(); }, 350);
	});

	$('.option-field-delete').click(function()
	{
		removeOptionField($('#option-field-' + $(this).attr('data-id')));
	});

	function removeOptionField(optionFieldToRemove)
	{
		if (optionFieldToRemove.hasClass('inline')) 
			optionFieldToRemove.hide();
		else
			optionFieldToRemove.stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});

		checkForSelectLabel(optionFieldToRemove, 0);
	}

	function checkForSelectLabel(optionField, increment)
	{		
		var categorySelect = optionField.siblings('.category-field-select');
		var select = categorySelect.find('input.select-dropdown');

		if (optionField.siblings('.option-field:visible').length + increment === 0)
			select.val("Choisissez " + categorySelect.attr('data-picking-text'));
		else
			select.val("Ajoutez " + categorySelect.attr('data-picking-text'));
	}
});

function encodeOptionValuesIntoHiddenInput()
{
	var optionValues = [];

	$('.option-field:visible').each(function() 
	{
		var option = {};
		option.id = $(this).attr('data-id');
		option.index = $(this).attr('data-index');
		option.description = $(this).find('.option-field-description-input[data-id=' + option.id + ']').val() || "";
		optionValues.push(option);
	});

	$('input#options-values').val(JSON.stringify(optionValues));
}