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
    $(document).on("click", ".vendor-meta-save", function(){
      $('.overlay, .modal, .modal-vendor-meta').hide();
      $('#main, .vendor-header, .vendor-header-2, .chat').removeClass('blur');      
    });
  },

  create: function create(){ 
    stores.push($store);
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

  setMetaData: function setMetaData(){
    $store.name = $('.store-meta-name').val();
    $store.avatar = $('.store-meta-avatar').val();
    $store.description = $('.store-meta-description').val();
    $store.guid = "bde33a7919ca28867d6b0acc5b9c09340607471a";
    $store.handle = $('.store-meta-handle').val().replace('@', '');      
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