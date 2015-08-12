$(function() {
  window.Settings.initialize();
});

window.Settings = {
  initialize: function() {
    $(document).on("click", ".user-unblock", function(event){ Settings.unblock(event) });
    $(document).on("click", ".clear-cache", function(event){ Settings.clearCache(event) });
    $(document).on("click", ".clear-peers", function(event){ Settings.clearPeers(event) });
    $(document).on("click", ".stop-server", function(event){ Settings.stopServer(event) });
    $(document).on("click", ".settings li", function(event){ Settings.changeType(event) });
    $(document).on("click", ".settings-edit-address", function(event){ Settings.editAddress(event) });
    $(document).on("click", ".modal-update-address", function(event){ Settings.saveAddress(event) });
    $(document).on("click", ".settings-address-new", function(event){ Settings.newAddress(event) });
    $(document).on("click", ".settings-delete-address", function(event){ Settings.deleteAddress(event) });
    $(document).on("click", ".menu-settings", function(event){
      Helper.hideAll();
      Page.setColors(User.find($session.handle));      
      Navigation.setPageUrl($session.handle + '/settings');   
      $('.settings').fadeTo(100,100).show();
      $('.input-settings-name').val($session.name);
      $.each(window.preloadData.countries, function(key, value) {   
        $('.input-settings-country, .input-edit-address-country, .input-new-address-country')
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
    $(document).on("blur", ".input-edit-address-city", function(event){ 
      var address = $('.input-edit-address-address').val() + ' ' + $('.input-edit-address-city').val();
      Settings.reloadMap(address);
    });
    $(document).on("blur", ".input-edit-address-state", function(event){ 
      var address = $('.input-edit-address-address').val() + ' ' + $('.input-edit-address-city').val() + ' ' + $('.input-edit-address-state').val();
      Settings.reloadMap(address);
    });
    $(document).on("blur", ".input-edit-address-postal-code", function(event){ 
      var address = $('.input-edit-address-address').val() + ' ' + $('.input-edit-address-city').val() + ' ' + $('.input-edit-address-state').val() + ' ' + $('.input-edit-address-postal-code').val();
      Settings.reloadMap(address);
    });
    $(document).on("change", ".input-edit-address-country", function(event){ 
      var address = $('.input-edit-address-address').val() + ' ' + $('.input-edit-address-city').val() + ' ' + $('.input-edit-address-state').val() + ' ' + $('.input-edit-address-postal-code').val() + ' ' + $('.input-edit-address-postal-country').val();
      Settings.reloadMap(address);
    });
    $(document).on("blur", ".input-new-address-city", function(event){ 
      var address = $('.input-new-address-address').val() + ' ' + $('.input-new-address-city').val();
      Settings.reloadMap(address);
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
      case "blocked":
        Settings.blocked();
        break;
      case "store":
        Settings.store();
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

  clearCache: function clearCache(){
    if (confirm("Are you sure you want to clear your cache?") == true) {
      new Notification('Cache cleared');     
    }
  },

  clearPeers: function clearPeers(){
    if (confirm("Are you sure you want to clear your peers?") == true) {
      new Notification('Peers cleared');     
    }
  },

  stopServer: function stopServer(event){
    if ($(event.currentTarget).html() === "Stop server"){
      if (confirm("Are you sure you want to stop your server?") == true) {
        new Notification('Server stopped');     
        $(event.currentTarget).html('Start server');
      }
    }else{
      if (confirm("Are you sure you want to start your server?") == true) {
        new Notification('Server started');     
        $(event.currentTarget).html('Stop server');
      }
    }
  },

  updateAddress: function updateAddress(){
    Modal.close();
  },

  unblock: function unblock(event){
    // new Notification('User unblocked');
    $(event.currentTarget).parent().parent().remove();
  },

  saveAddress: function saveAddress(){
    Modal.close();
    var address = $('.input-new-address-address').val() + ' ' + $('.input-new-address-address2').val() + ' ' + $('.input-new-address-city').val() + ', ' + $('.input-new-address-state').val() + $('.input-new-address-postal-code').val() 
    $('.settings-shipping table').prepend('<tr><td class="border-secondary-color">' + $('.input-new-address-name').val() + '<div class="type-opacity position-margin-top-2px">' + address + '</div></td><td class="border-secondary-color type-align-right"><button class="button-primary secondary-color settings-edit-address">Edit</button> <button class="button-primary secondary-color settings-delete-address">Delete</button></td></tr>');
    Page.setColors(User.find($session.handle));     
  },

  hideAll: function hideAll(){
    $('.settings-advanced, .settings-general, .settings-shipping, .settings-keys, .settings-store, .settings-blocked').hide();
  },

  general: function general(){
    $('.settings-new').hide();
    $('.settings-general, .settings-save-changes').show();
    Navigation.setPageUrl($session.handle + '/settings');
  },

  shipping: function shipping(){
    $('.settings-save-changes').hide();
    $('.settings-shipping, .settings-new').show();
    Navigation.setPageUrl($session.handle + '/settings/shipping');
  },

  store: function store(){
    $('.settings-new').hide();
    $('.settings-store, .settings-save-changes').show();
    Navigation.setPageUrl($session.handle + '/settings/store');
  },

  blocked: function blocked(){
    $('.settings-new').hide();
    $('.settings-blocked').show();
    Navigation.setPageUrl($session.handle + '/settings/blocked');
    $('.search-blocked').focus();
  },

  keys: function keys(){
    $('.settings-new, .settings-save-changes').hide();
    $('.settings-keys').show();
    Navigation.setPageUrl($session.handle + '/settings/keys');

  },

  advanced: function advanced(){
    $('.settings-new').hide();
    $('.settings-advanced, .settings-save-changes').show();
    Navigation.setPageUrl($session.handle + '/settings/advanced');
  },

  reloadMap: function reloadMap(address){
    $('#google-map').attr('src', 'https://www.google.com/maps/embed/v1/place?q=' + address.replace(/ /g, '+') + '&key=AIzaSyCEFvQuq6vJM7w6CLg_xyQwTIDg_EFjihM');
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