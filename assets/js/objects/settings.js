$(function() {
  window.Settings.initialize();
});

window.Settings = {
  initialize: function() {
    $(document).on("click", ".settings li", function(event){ Settings.changeType(event) });
    $(document).on("click", ".settings-edit-address", function(event){ Settings.editAddress(event) });
    $(document).on("click", ".settings-address-new", function(event){ Settings.newAddress(event) });
    $(document).on("click", ".settings-delete-address", function(event){ Settings.deleteAddress(event) });
    $(document).on("click", ".menu-settings", function(event){
      Helper.hideAll();
      Page.setColors(User.find($session.handle));      
      Navigation.setPageUrl($session.handle + '/settings');   
      $('.settings').fadeTo(100,100).show();
      $('.input-settings-name').val($session.name);

      $.each(window.preloadData.countries, function(key, value) {   
        $('.input-settings-country')
          .append($('<option></option>')
          .attr('value',value)
          .text(value)); 
      });

      $.each(window.preloadData.currencies, function(key, value) {   
        $('.input-settings-currency')
          .append($('<option></option>')
          .attr('value',value)
          .text(value)); 
      });

      $.each(window.preloadData.timeZones, function(key, value) {   
        $('.input-settings-time-zone')
          .append($('<option></option>')
          .attr('value',value)
          .text(value)); 
      });
      
    });
  },

  changeType: function changeType(event){

    Settings.hideAll();
    switch($(event.currentTarget).attr('data-section')){
      case "general":
        Settings.general();
        break;
      case "shipping":
        Settings.shipping();
        break;
      case "keys":
        Settings.keys();
        break;
      case "advanced":
        Settings.advanced();
        break;
    }

    $('.settings li').removeClass('user-page-navigation-selected');
    $(event.currentTarget).addClass('user-page-navigation-selected');
    Page.setColors(User.find($session.handle));   
  },

  deleteAddress: function deleteAddress(event){
    if (confirm("Are you sure you want to delete this address?") == true) {
      new Notification('Address deleted');     
      $(event.currentTarget).parent().parent().remove();
    }
  },

  hideAll: function hideAll(){
    $('.settings-advanced, .settings-general, .settings-shipping, .settings-keys').hide();
  },

  general: function general(){
    $('.settings-new').hide();
    $('.settings-general, .settings-save-changes').show();
  },

  shipping: function shipping(){
    $('.settings-save-changes').hide();
    $('.settings-shipping, .settings-new').show();
  },

  keys: function keys(){
    $('.settings-new, .settings-save-changes').hide();
    $('.settings-keys').show();
  },

  advanced: function advanced(){
    $('.settings-new').hide();
    $('.settings-advanced, .settings-save-changes').show();
  },

  editAddress: function editAddress(event){
    var address = $(event.currentTarget).attr('data-address') + ' ' + $(event.currentTarget).attr('data-city') + ' ' + $(event.currentTarget).attr('data-state') + ' ' + $(event.currentTarget).attr('data-postal-code');
    $('#google-map').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + address.replace(/ /g, '+') + '&key=AIzaSyCEFvQuq6vJM7w6CLg_xyQwTIDg_EFjihM');
    $('.overlay').show();
    Modal.show();
    $('.modal-new-address').hide();
    $('.modal-address, .modal-edit-address').show();
    $('.input-edit-address-name').val($(event.currentTarget).attr('data-name'));
    $('.input-edit-address-address').val($(event.currentTarget).attr('data-address'));
    $('.input-edit-address-address2').val($(event.currentTarget).attr('data-address2'));
    $('.input-edit-address-city').val($(event.currentTarget).attr('data-city'));
    $('.input-edit-address-state').val($(event.currentTarget).attr('data-state'));
    $('.input-edit-address-postal-code').val($(event.currentTarget).attr('data-postal-code'));
    $('.input-edit-address-country').val($(event.currentTarget).attr('data-country'));
    $('.input-edit-address-name').focus();
  },

  newAddress: function newAddress(event){
    $('#google-map').attr('src', 'https://www.google.com/maps/embed/v1/place?q=North+America&key=AIzaSyCEFvQuq6vJM7w6CLg_xyQwTIDg_EFjihM');
    $('.overlay').show();
    Modal.show();
    $('.modal-edit-address').hide();
    $('.modal-address, .modal-new-address').show();
    $('.input-new-address-name').focus();
  },

  addAddress: function addAddress(){
    $('.overlay').show();
    Modal.show();
    $('.modal-address, .modal-add-address').show();
    $('.input-new-address-name').focus();
  }
}