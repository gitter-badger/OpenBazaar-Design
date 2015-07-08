$(function() {
  window.Vendor.initialize();
});

window.Vendor = {
  initialize: function() {
    $(document).on("click", ".contract-vendor-name", function(event) { 
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Vendor.displayContracts(Vendor.find(vendorGuid), true, false);
      Vendor.setActiveTab();
      $('.vendor-home').addClass('vendor-navigation-selected');
    });
    $(document).on("click", ".item-vendor-name, .vendor-header .vendor-name, .vendor-header .vendor-avatar, .vendor-home", function(event) { 
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
      Vendor.displayContracts(Vendor.find(vendorGuid), true, false);
    });
    $(document).on("click", ".trade-back-to-payment", function(){ Vendor.tradeBackToPayment() });
    $(document).on("click", ".trade-back-to-address", function(){ Vendor.tradeBackToAddress() });
    $(document).on("click", ".vendor-dets", function(event){
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      var vendor = Vendor.find(vendorGuid);
      Vendor.displayDetails(vendor);
      Vendor.setSecondaryColor(vendor.colorsecondary);
      Vendor.setPrimaryColor(vendor.colorprimary);
      Vendor.setBackgroundColor(vendor.colorbackground);
      Vendor.setTextColor(vendor.colortext);
      Vendor.setActiveTab();
      $('.vendor-dets').addClass('vendor-navigation-selected');
    });
    $('.user-configuration-primary-color').ColorPicker({
      color: defaultPrimaryColor,
      onChange: function (hsb, hex, rgb) {
        Vendor.setPrimaryColor(hex);
      } 
    });
    $('.user-configuration-secondary-color').ColorPicker({
      color: defaultSecondaryColor,
      onChange: function (hsb, hex, rgb) {
        Vendor.setSecondaryColor(hex);
      } 
    });
    $('.user-configuration-font-color').ColorPicker({
      color: defaultTextColor,
      onChange: function (hsb, hex, rgb) {
        Vendor.setTextColor(hex);
      } 
    });
    $(document).on("click", ".vendor-meta-save", function(){
      $('.overlay, .modal, .modal-vendor-meta').hide();
      $('#main, .vendor-header, .vendor-header-2, .chat').removeClass('blur');      
    });
  },

  create: function create(){ 
    stores.push($store);
  },

  displayContracts: function displayContracts(vendor, updatePageViews, instant, autoConnect){  
    if (instant){ delay = 0; fade = 0; } else {  delay = 1900; fade = 500; }
    $('.contracts, .vendor-contracts').empty();
    if (updatePageViews){
      pageViews.push({"page": "vendor", "guid": vendor.guid, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    _.each(vendor.contracts, function(contract, index){
      Contract.renderGridContract(vendor, contract, '.vendor-contracts');
    });

    Helper.hideAll();
    Vendor.setSecondaryColor(vendor.colorsecondary);
    Vendor.setBackgroundColor(vendor.colorbackground);
    Vendor.setTextColor(vendor.colortext);
    Vendor.setPrimaryColor(vendor.colorprimary);
    $('.vendor-home').addClass('vendor-navigation-selected');
    $('.connecting').fadeIn();
    $('.loading-icon').attr('src', vendor.avatar).show();
    $('.vendor-message').attr('data-vendor-guid', vendor.guid);
    $('.loading-message').html('Connecting to ' + Vendor.handle(vendor));
    Connect.load();
    setTimeout(function(){  
      if (Connect.toVendor() || autoConnect){
        $('.contracts, .connecting').hide();
        $('.vendor-contracts, .vendor-buttons').show();
        $('.vendor-name').html(vendor.name).attr('data-vendor-guid', vendor.guid);
        $('.vendor-handle').html('@' + vendor.handle).attr('data-vendor-guid', vendor.guid);
        $('.vendor-home').attr('data-vendor-guid', vendor.guid);
        $('.vendor-dets').attr('data-vendor-guid', vendor.guid);
        $('.vendor-description').html(vendor.description);
        $('.vendor-avatar').css('background-image', 'url(' + vendor.avatar + ')').attr('data-vendor-guid', vendor.guid);
        $('.vendor-header, .vendor-navigation').show();
        if (instant){
          $('.vendor').show();
        }else{
          $('.vendor').fadeIn('slow');
        }
      }else{
        $('#spinner').empty().hide();
        $('.loading-message').html('Connection failed');
        $('.button-try-again').removeData().attr('data-vendor-guid', vendor.guid).attr('data-view', "item-detail").attr('data-view', "vendor").show();
      }
    }, delay);
  }, 

  displayDetails: function displayDetails(vendor){  
    Helper.hideAll();
    $('.vendor, .vendor-header, .vendor-navigation').show();
    $('.vendor-details').fadeIn('fast');
    $('.vendor-details-website').html('<a href="' + vendor.website + '" target="_blank">' + vendor.website + '</a>');
    $('.vendor-details-email').html(vendor.email);
    $('.vendor-details-public-key').html(vendor.publicKey);
    $('.vendor-details-pledge').html(vendor.pledge);
    $('.vendor-details-pgp-key').html($.parseHTML(vendor.pgpKey));
  },
  
  find: function find(guid){  
    return _.find(vendors, function(vendor){ return vendor.guid == guid });
  },  

  findByHandle: function findByHandle(handle){  
    return _.find(vendors, function(vendor){ return vendor.handle == handle.replace('@','') });
  },  

  handle: function handle(vendor){  
    if (vendor.handle){
      var name = '@' + vendor.handle;
    }else{
      var name = vendor.name;
    }   
    return name;
  }, 

  setActiveTab: function setActiveTab(event){
    $('.vendor-navigation ul li').removeClass('vendor-navigation-selected');
  },

  setMetaData: function setMetaData(){
    $store.name = $('.store-meta-name').val();
    $store.avatar = $('.store-meta-avatar').val();
    $store.description = $('.store-meta-description').val();
    $store.guid = "bde33a7919ca28867d6b0acc5b9c09340607471a";
    $store.handle = $('.store-meta-handle').val().replace('@', '');      
  },

  setPrimaryColor: function setPrimaryColor(hex){  
    hex = hex.replace('#','');
    $('.vendor, .contract-detail, .navigation-controls, .vendor-navigation-selected, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .modal, .modal-pretty, .modal-body, .vendor-avatar').css('background-color', '#' + hex);
    $('.user-configuration-primary-color').css('background-color', '#' + hex);
    $('.modal-pretty button.button-first').css('border-right-color', '#' + hex);
    $('.vendor-navigation').css('border-color', '#' + hex);
    $store.colorprimary = '#' + hex;
  },

  setSecondaryColor: function setSecondaryColor(hex){  
    hex = hex.replace('#','');
    $('#header, .settings-contract, .vendor-navigation, .vendor-navigation ul li, .settings-contract-meta-data, .contract-meta-data, .vendor-header-2, .pod, .user-configuration-secondary-color, .transactions table thead tr, .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .dropzone').css('background-color', '#' + hex);
    $('.modal-pretty table td').css('border-bottom-color', '#' + hex);
    $store.colorsecondary = '#' + hex;
  },

  setBackgroundColor: function setBackgroundColor(hex){  
    hex = hex.replace('#','');
    $('body').css('background-color', '#' + hex);
  },

  setTextColor: function setTextColor(hex){  
    hex = hex.replace('#','');
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .user-configuration-contracts .settings-contract-meta-data, .contract-meta-data, .settings-add-new, .user-configuration-contracts .settings-contact-price, .modal input, .modal select, .modal textarea, .modal-pretty input, .modal-pretty select, .modal-pretty textarea, .modal-pretty button').css('color',  '#' + hex);
    $('.user-configuration-font-color').css('background-color', '#' + hex);
    $('.settings-add-new').css('border-color', '#' + hex);
    $store.colortext = '#' + hex;
  },

  tradeBackToPayment: function tradeBackToPayment(){
    Modal.setTitle('Payment type');
    $('.modal-trade-flow-address').hide();
    $('.modal-trade-flow-payment-type').show();
  },

  tradeBackToAddress: function tradeBackToAddress(){
    var image = $('.item-detail-image').css('background-image');
    Modal.setTitle('Ship to');
    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat'); 
    $('.modal-trade-flow-summary').hide();
    $('.modal-item-price-style, .modal-photo-shadow, .modal-trade-flow-address').show();
  },
}