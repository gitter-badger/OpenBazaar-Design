$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .user-page-header, .chat').removeClass('blur');
    $('.contracts, .discover, .onboarding, .user-page, .vendor-navigation, .ob-icon, .contract-detail, .user-configuration, .vendor-header, .vendor-header-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases, .modal, .modal-pretty, .settings').hide();
    $('.user-page-configuration-colors, .user-page-social .input, .user-page-about .textarea').hide();
  },

  colorToHex: function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
      return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
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

  resizeWindow: function resizeWindow() {
    var height = $(window).height() - $('#header').outerHeight();
    $('#main').css('height', height);
  },

  setDefualtColors: function setDefualtColors(instant){
    if (instant){
      $('body').css('background', '#074161');
      $('.user-page-navigation li, .button-first').css('border-color', defaultPrimaryColor); 
      $('.modal-pretty tbody td, .discover-vendors-list tr, .list-input').css('border-color', defaultSecondaryColor); 
      $('#header, .user-page-navigation, .user-page-navigation li, .button-primary, .item-meta-data, thead tr, .modal-footer, .modal-footer button').css('background', defaultSecondaryColor); 
      $('.navigation-controls, .navigation-controls span, .control-panel li, .user-page-navigation-selected, .modal-body, .transactions-body, .pill').css('background', defaultPrimaryColor);
      $('.item-price, .item-meta-data').css('color', defaultTextColor); 
      $('.user-page-navigation-selected .pill').css('background', defaultSecondaryColor);
    }else{
      $('body').animate({ backgroundColor: '#074161', color: defaultTextColor }, fade);
      $('.user-page-navigation li, .button-first').css('border-color', defaultPrimaryColor); 
      $('.modal-pretty tbody td, .discover-vendors-list tr, .list-input').css('border-color', defaultSecondaryColor); 
      $('#header, .user-page-navigation, .user-page-navigation li, .button-primary, .item-meta-data, thead tr, .modal-footer, .modal-footer button').animate({ backgroundColor: defaultSecondaryColor }, fade);  
      $('.navigation-controls, .navigation-controls span, .control-panel li,.user-page-navigation-selected, .modal-body, .transactions-body, .pill').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
      $('.item-meta-data, .item-price').animate({ color: defaultTextColor });
      $('.user-page-navigation-selected .pill').css('background', defaultSecondaryColor);

    }
  }
}