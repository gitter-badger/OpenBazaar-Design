$(function() {
  window.Helper.initialize();
});

window.Helper = {
  initialize: function() {
  },

  hideAll: function hideAll(){
    $('#main, .user-page-header, .chat').removeClass('blur');
    $('.contracts, .overlay, .notifications, .discover, .onboarding, .user-page, .vendor-navigation, .ob-icon, .contract-detail, .user-configuration, .vendor-header, .vendor-header-2, .vendor-footer, .button-try-again, .vendor-details, .transactions, .transactions-purchases, .transactions-sales, .transactions-cases, .modal, .modal-pretty, .settings, .user-page-add-contract').hide();
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

  stringToSlug: function stringToSlug(text) {
    return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
  },

  setDefualtColors: function setDefualtColors(instant){
    if (instant){
      $('body').css('background', '#074161');
      $('.border-primary-color').css('border-color', defaultPrimaryColor); 
      $('.border-secondary-color').css('border-color', defaultSecondaryColor); 
      $('.secondary-color').css('background', defaultSecondaryColor); 
      $('.primary-color').css('background', defaultPrimaryColor);
      $('.item-price, .item-meta-data').css('color', defaultTextColor); 
      $('.user-page-navigation-selected .pill').css('background', defaultSecondaryColor);
    }else{
      $('body').animate({ backgroundColor: '#074161', color: defaultTextColor }, fade);
      $('.border-primary-color').css('border-color', defaultPrimaryColor); 
      $('.border-secondary-color').css('border-color', defaultSecondaryColor); 
      $('.secondary-color').animate({ backgroundColor: defaultSecondaryColor }, fade);  
      $('.primary-color').animate({ backgroundColor: defaultPrimaryColor, color: defaultTextColor }, fade);
      $('.item-meta-data, .item-price').animate({ color: defaultTextColor });
      $('.user-page-navigation-selected .pill').css('background', defaultSecondaryColor);

    }

    $('.input-chat-new-message, .chat-list-input-new').css('border-color', '#424242');
  }
}