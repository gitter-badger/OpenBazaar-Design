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
      $('body').css('background', '#08486B');
      $('.user-page-navigation li').css('border-color', defaultPrimaryColor); 
      $('#header, .user-page-navigation, .item-meta-data').css('background', defaultSecondaryColor); 
      $('.navigation-controls, .navigation-controls span, .control-panel li, .user-page-navigation-selected').css('background', defaultPrimaryColor);
      $('.item-price, .item-meta-data').css('color', defaultTextColor); 
    }else{
      $('body').animate({ backgroundColor: '#08486B', color: defaultTextColor }, fade);
      $('.user-page-navigation li').css('border-color', defaultPrimaryColor); 
      $('#header, .user-page-navigation, .item-meta-data').animate({ backgroundColor: defaultSecondaryColor }, fade);  
      $('.navigation-controls, .navigation-controls span, .control-panel li,.user-page-navigation-selected').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
      $('.item-meta-data, .item-price').animate({ color: defaultTextColor });

    }
  }
}