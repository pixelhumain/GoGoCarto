var apiDelete, apiResolve, apiMarkAsNonDuplicate;
if ($('#page-content.duplicates').length > 0)
{
  $(document).ready(function() {
    $('.actions button, .actions a').click(function(e) {
      e.stopPropagation();
    });

    $('.non-duplicates a').click(function() {
      var button = $(this);
      jQuery.post(apiMarkAsNonDuplicate, {elementId: button.data('id')}, function(data, textStatus, xhr) {
        button.closest('.duplicate-node').hide();
      });      
    });

    $('.btn-resolve').click(function() {
      var button = $(this);
      if (button.hasClass('disabled')) return false;
      jQuery.post(apiResolve, {elementId: button.data('id'), message: "Doublon conservé"}, function(data, textStatus, xhr) {
        console.log(data);
        button.text('Conservé !');
        button.addClass('action-done');
        button.siblings('.btn').addClass('disabled');
      });      
    });

    $('.btn-delete').click(function() {
      var button = $(this);
      if (button.hasClass('disabled')) return false;
      jQuery.post(apiDelete, {elementId: button.data('id'), message: "Doublon supprimé"}, function(data, textStatus, xhr) {
        console.log(data);
        button.text('Supprimé !');
        button.addClass('action-done');
        button.siblings('.btn').addClass('disabled');
      });      
    });
  });  
}