$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .user-page-header, .chat').removeClass('blur');
    $('.contracts, .discover, .onboarding, .user-page, .vendor-navigation, .ob-icon, .contract-detail, .user-configuration, .vendor-header, .vendor-header-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases').hide();
  },

  readURL: function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('.avatar-circle, .control-panel-user').css('background', 'url(' + e.target.result + ') 50% 50% / cover no-repeat');
      }

    reader.readAsDataURL(input.files[0]);
    }
  },

  setDefualtColors: function setDefualtColors(instant){
    if (instant){
      $('body').css('background', '#00527E');
      $('.user-page-navigation li, .button-first').css('border-color', defaultPrimaryColor); 
      $('.modal-pretty tbody td, .discover-vendors-list tr').css('border-color', defaultSecondaryColor); 
      $('#header, .user-page-navigation, .user-page-navigation li, .button-primary, .item-meta-data, thead tr, .modal-footer, .modal-footer button').css('background', defaultSecondaryColor); 
      $('.navigation-controls, .navigation-controls span, .control-panel li, .user-page-navigation-selected, .modal-body').css('background', defaultPrimaryColor);
      $('.item-price, .item-meta-data').css('color', defaultTextColor); 
    }else{
      $('body').animate({ backgroundColor: '#00527E', color: defaultTextColor }, fade);
      $('.user-page-navigation li, .button-first').css('border-color', defaultPrimaryColor); 
      $('.modal-pretty tbody td, .discover-vendors-list tr').css('border-color', defaultSecondaryColor); 
      $('#header, .user-page-navigation, .user-page-navigation li, .button-primary, .item-meta-data, thead tr, .modal-footer, .modal-footer button').animate({ backgroundColor: defaultSecondaryColor }, fade);  
      $('.navigation-controls, .navigation-controls span, .control-panel li,.user-page-navigation-selected, .modal-body').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
      $('.item-meta-data, .item-price').animate({ color: defaultTextColor });

    }
  }
}