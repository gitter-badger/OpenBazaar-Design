$(function() {
  window.Contract.initialize();
});

window.Contract = {
  initialize: function() {
    $(document).on("click", ".user-page-contract-detail-buy", function(){  Contract.displayCheckout() });
    $(document).on("click", ".contract-image, .contract-name", function(event){ Contract.displayDetails(event) });
    $(document).on("click", ".contract-trade-payment-type-next", function(event){ Contract.displayTradeFlowAddress() });
    $(document).on("click", ".contract-trade-address-next", function(event){ Contract.displayTradeFlowSummary() });
    $(document).on("click", ".new-product-save", function(){ Contract.create() });
    $(document).on("click", ".contract-delete, .user-page-contract-delete", function(event){ Contract.deleteConfirm(event) });
    $(document).on("click", ".contract-edit, .user-page-contract-edit", function(event){ Contract.edit(event) });
    $(document).on("mouseenter", ".contract", function(event){ Contract.hoverItem(event) });
    $(document).on("mouseleave", ".contract", function(event){ Contract.unhoverItem(event) });
    $(document).on("mouseover", ".contract-image", function(event){ Contract.hover(event) });
    $(document).on("mouseleave", ".contract-image", function(event){ Contract.unhover(event) });
    $(document).on("click", ".contract-menu", function(event){ Contract.showActions(event) });
    $(document).on("click", ".action-hide-item", function(event){ 
      $(event.currentTarget).parent().parent().parent().remove(); 
    });
    $(document).on("click", ".action-block-user", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      console.log($(event.currentTarget).attr('data-user-handle'));
      if (confirm("Are you sure you want to block this user? They'll no longer be able to message you or view your page.") == true) {
        User.block(user);
        $(".contract[data-vendor-handle='" + user.handle + "']").remove();
        $(".chat-view-details[data-user-handle='" + user.handle + "']").remove();
        $('.chat-conversation-detail').hide();
        $('.chat-view-details').removeClass('chat-active');
        $('.chat table tr').css('opacity','1');
      }
    });
  },

  create: function create(){
    var items = $store.items;
    var item = [];
    var id = Math.ceil(Math.random() * 10000) + 500

    item.id = id;
    item.name = $('.new-product-name').val();
    item.description = $('.new-product-description').val();
    item.price = $('.new-product-price').val();
    item.shipping = $('.new-product-shipping').val();
    item.type = $('.new-product-condition').val();
    item.photo1 = $('.new-product-photo-1').val();
    item.photo2 = $('.new-product-photo-2').val();
    item.photo3 = $('.new-product-photo-3').val();

    items.push(item);
    $store.items = items;

    // add prodcut to items list
    $('.store-settings-items').append('<div class="settings-item" data-store-guid="" data-item-id="' + id +'"><div class="settings-item-image opacity-0" data-store-guid="" data-item-id="' + id +'" style="background: url(' + $('.new-product-photo-1').val() + ') 50% 50% / cover no-repeat"><div class="settings-item-image-gradient"></div><div class="settings-item-buttons visibility-hidden"><button id="' + id + '" class="button-primary settings-item-edit position-margin-right-5px">Edit</button><button id="' + id + '" class="button-primary settings-item-delete">Delete</button></div></div><div class="settings-item-meta-data" data-store-guid=""><div><div class="settings-item-name" data-store-guid="" data-item-id="' + id +'">' + $('.new-product-name').val() + '</div><div class="settings-item-price position-margin-top-3px">$23.52 (' + $('.new-product-price').val() + ' btc)</div></div>');

    // reset the colors
    Vendor.setPrimaryColor($('.user-configuration-primary-color').css('bgColor'));
    Vendor.setSecondaryColor($('.user-configuration-secondary-color').css('bgColor'));
    Vendor.setTextColor($('.user-configuration-font-color').css('bgColor'));

    // hide stuffs
    $('#main, .store-banner, .store-banner-2, .chat').removeClass('blur');
    $('.overlay').hide();
    $('.modal').hide();      
    $('.settings-item-image').css('opacity', 100);
  },

  remove: function remove(event){
  },

  edit: function edit(event){
    var user = User.find($session.handle);
    var contract = _.find(user.contracts, function(contract){ return contract.id == $(event.currentTarget).attr('data-contract-id') });
    Helper.hideAll();
    Page.hideSections();
    Navigation.setPageUrl(user.handle + '/store/edit/' + Helper.stringToSlug(contract.name));
    Page.setColors(user);
    Page.setMetaData(user);
    $('.input-new-contract-name').val(contract.name);
    $('.input-new-contract-price').val(contract.price);
    $('.input-new-contract-shipping').val(contract.shipping);
    $('.input-new-contract-available').val(contract.available);
    $('.input-new-contract-keywords').val(contract.keywords);
    $('.input-new-contract-type').val(contract.type);
    $('.input-new-contract-condition').val(contract.condition);
    $('.input-new-contract-nsfw').val(contract.nsfw);
    $('.input-new-contract-description').val(contract.description);
    // $('.input-user-page-add-contract-photo').val(contract.photo1);
    $('.user-page-contract-detail-image').css('background', 'url(' + contract.photo1 + ') 50% 50% / cover no-repeat');


    $('.user-page-contracts, .user-contract-actions').hide();
    $('.user-page-add-contract, .user-page-actions-configuration').show();
    $('.input-new-contract-name').focus();
    $('#main').addClass('edit-mode');
    $('#button-user-page-header').addClass('active');
    $('.user-page-actions-self, .user-page-actions-primary, .chat').hide();
    $('.user-page').show();

  },

  showActions: function showActions(event){
    Helper.setDefualtColors(true);
    $('.contract-actions').hide();
    $(event.currentTarget).parent().find('.contract-actions').show();
  },

  // hideActions: function hideActions(event){
  //   event.stopPropagation();
  //   event.preventDefault();
  //   $('.contract-actions').hide();
  // },

  deleteConfirm: function deleteConfirm(event){
    event.stopPropagation();
    var user = User.find($(event.currentTarget).attr('data-vendor-handle'));
    if (confirm("Are you sure you want to delete this item?") == true) {
      new Notification('Item deleted');     
      $(event.currentTarget).parent().parent().remove();
    }
  },

  displayCheckout: function displayCheckout(){  
    $('.modal-purchase-detail, .modal-trade-flow-address, .modal-trade-flow-summary').hide();
    $('.modal-trade-flow-payment-type, .modal-trade-flow-address-existing').show();
    $('.modal-trade-flow-address-new').hide();

    var image = $('.user-page-contract-detail-image').css('background-image');
    var avatar = $('.user-page-avatar').css('background-image');
    var price = $('.user-page-contract-detail-price').html();
    var name = $('.user-page-name').html();

    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat');
    $('.modal-pretty .direct-avatar').css('background', avatar + '100% 100% / cover no-repeat');
    $('.modal-pretty .modal-contract-price').html(price);
    $('.modal-pretty .modal-vendor-name').html(name);
    $('.modal-trade-flow-new-address').hide();
    $('#google-map-address').hide();

    $('#main, .vendor-header').addClass('blur');
    $('.modal-product, .modal-vendor-meta').hide();
    $('.overlay, .modal-trade-flow').show();
    $('.modal-pretty').fadeTo(100, 100);
  },

  displayDetails: function displayDetails(event){  
    event.stopPropagation();
    event.preventDefault();
    var guid = $(event.currentTarget).attr('data-vendor-guid');
    var contractId = $(event.currentTarget).attr('data-contract-id');
    var user = User.findByGuid(guid);
    var contract = _.find(user.contracts, function(contract){ return contract.id == contractId });
    $('.contracts').hide();
    Navigation.stripPageHistory();
    Navigation.setArrowOpacity();
    Helper.hideAll();
    Page.contract(user, contract, true);
  },

  displayContractInModal: function displayContractInModal(){
    Modal.clear();
    $('.modal-qr-payment').hide();
    $('.new-product-name').val(product.name);
    $('.new-product-description').val(product.description);
    $('.new-product-price').val(product.price);
    $('.new-product-shipping').val(product.shipping);
    // $('.new-product-condition').val();
    $('.new-product-photo-1').val(product.photo1);
    $('.new-product-photo-2').val(product.photo2);
    $('.new-product-photo-3').val(product.photo3);
    $('.new-product-website').val(product.photo3);

    Modal.show('basic');
  },

  displayTradeFlowSummary: function displayTradeFlowSummary(){
    $('#google-map-address').hide();
    $('.modal-qr-payment').show();
    $('.modal-contract-price').show();
    $('.modal-item').html($('.user-page-contract-detail-name').html());
    $('.modal-trade-flow-address').hide();
    $('.modal-trade-flow-summary').show();
    $('.modal-item-price-style, .modal-photo-shadow').hide();
    $('.modal-trade-flow-new-address').hide();
    $('.modal-photo').css('background','#fff');
    Modal.setTitle('Summary');
  },

  displayTradeFlowAddress: function displayTradeFlowAddress(){
    $('.modal-qr-payment').hide();
    $('.modal-trade-flow-payment-type, .modal-trade-flow-address-new').hide();
    $('.modal-trade-flow-address, .modal-trade-flow-address-existing').show();
    $('.modal-trade-flow-new-address').show();
    $('.modal-contract-price').show();
    Modal.setTitle('Ship to');
  },

  find: function find(id){
    return _.find($store, function(contract){ return contract.id == id });     
  },

  hoverItem: function hoverItem(event){
    $(event.currentTarget).find('.contract-menu').show();
  },

  unhoverItem: function unhoverItem(event){
    $(event.currentTarget).find('.contract-menu').hide();
  },

  hover: function hover(event){
    var user = User.find($(event.currentTarget).attr('data-vendor-handle'));
    if(user.handle === $session.handle && $('.discover').not(':visibile')){
      $(event.currentTarget).find('.contract-delete').show();
      Page.setPrimaryColor(user.colorprimary);
    }
  },

  unhover: function unhover(event){
    $('.contract-delete').hide();
  },

  renderGridContract: function renderGridContract(vendor, contract, div){
    if (vendor.handle){
      var name = vendor.handle;
    }else{
      var name = vendor.name;
    }

    var randomNum = Math.ceil(Math.random() * 500) + 75;
    var output = '<div class="contract border-secondary-color" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'" data-vendor-handle="' + vendor.handle + '"><div class="contract-actions primary-color border-secondary-color"><ul><li data-user-handle="' + vendor.handle + '" class="action-block-user">Block user</li></ul></div><div class="contract-menu"><svg viewBox="-90 0 240 78" class="icon-more  position-float-right" style="width: 40px; height: 40px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-more"></use></svg></div><div class="contract-image opacity-0" data-vendor-handle="' + vendor.handle + '"  data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'" style="background: url(' + contract.photo1 + ') 50% 50% / cover no-repeat"><button data-vendor-handle="' + vendor.handle + '"  data-contract-id="' + contract.id +'" class="button-primary contract-delete primary-color">Delete</button><div class="contract-image-gradient"></div></div><div class="contract-meta-data" data-vendor-guid="' + vendor.guid + '"><div class="contract-vendor-avatar" style="background-image: url(' + vendor.avatar + ')"  data-user-handle="' + vendor.handle +'"></div><div><div class="contract-name" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'">' + contract.name + '</div><div class="contract-price position-margin-top-3px">$23.52 (' + contract.price + ' btc)</div></div>';

    if (div === '.discover-contracts'){
      // output += '<div class="contract-vendor" data-contract-id="' + contract.id +'"><div class="contract-vendor-avatar" style="background-image: url(' + vendor.avatar + ')"  data-contract-id="' + contract.id +'"></div><div class="contract-vendor-name" data-vendor-guid="' + vendor.guid + '" data-contract-id="' + contract.id +'">' + name + '</div></div>';
    }else{
      output += '</div></div></div>';
    }

    $(div).append(output);
    $(div + ' div:last-child .contract-image').delay(20).fadeTo(randomNum, 1);
    if (div === '.discover-contracts'){
      Helper.setDefualtColors(true);
    }
  },

  renderContractDetail: function renderContractDetail(vendor, contract, updatePageViews){  
    activePage = Navigation.getActivePageType();
    Navigation.setPageUrl(vendor.guid + '/' + contract.id);

    if (updatePageViews){
      pageViews.push({"page": "contract", "contractid": contract.id, "guid": vendor.guid, "active": true});
      Navigation.unsetActivePage(); 
      Navigation.setArrowOpacity();
    } 

    if (contract.quantity === 0){
      $('.contract-detail-buy, .input-contract-detail-quantity').hide();
      $('.contract-detail-sold-out').show();
    }else{
      $('.contract-detail-buy, .input-contract-detail-quantity').show();
      $('.contract-detail-sold-out').hide();
    } 

    $('.contract-detail-price').html('<span class="type-weight-medium">' + contract.price + ' btc</span>');
    $('.contract-detail-quantity').val(1);  
    $('.vendor-message').attr('data-vendor-guid', vendor.guid);
    $('.vendor-dets').attr('data-vendor-guid', vendor.guid);

    if (contract.type === "physical"){
      $('.contract-detail-shipping').html('shipping: <span class="type-weight-medium">+' + contract.shipping + ' btc</span>').show();
      $('.contract-detail-condition').html('condition: <span class="type-weight-medium">' + contract.condition + '</span>').show();
      $('.contract-detail-type').hide();
      $('.contract-detail-quantity').show();
      $('.contract-detail-buy').html('Buy');
    }else{
      $('.contract-detail-type, .contract-detail-quantity, .contract-detail-shipping, .contract-detail-condition').hide();
      $('.contract-detail-buy').html('Buy & download');
    }

    if (activePage === "vendor"){
      $('.vendor, .contract-detail, .button-try-again').hide();
      $('.contract-detail-name').html(contract.name);
      $('.contract-detail-description').html(contract.description);
      $('.contract-detail-image').css('background-image', 'url(' + contract.photo1 + ')');
      $('.contract-detail-meta').css('background', vendor.colorsecondary);
      $('.contract-detail').fadeIn('slow');
    }else{
      $('.vendor, .vendor-header, .contracts, .ob-icon, .button-try-again').hide();
      $('.connecting').fadeIn();
      $('.loading-icon').attr('src', vendor.avatar).show();
      $('.loading-message').html('Connecting to ' + Vendor.handle(vendor));
      Connect.load();
      Vendor.setSecondaryColor(vendor.colorsecondary);
      Vendor.setPrimaryColor(vendor.colorprimary);
      Vendor.setBackgroundColor(vendor.colorbackground);
      Vendor.setTextColor(vendor.colortext);
      setTimeout(function(){  
        if (Connect.toVendor()){
          $('.contract, .connecting').hide();
          $('.vendor-name').html(Vendor.handle(vendor)).attr('data-vendor-guid', vendor.guid);
          $('.vendor-home').attr('data-vendor-guid', vendor.guid);
          $('.vendor-description').html(vendor.description);
          $('.vendor-avatar').css('background-image', 'url(' + vendor.avatar + ')').attr('data-vendor-guid', vendor.guid);
          $('.vendor-header, .vendor-navigation').show();
          $('.contract-detail-name').html(contract.name);
          $('.contract-detail-description').html(contract.description);
          $('.contract-detail-image').css('background-image', 'url(' + contract.photo1 + ')');
          $('.contract-detail').fadeIn('slow');
        }else{
          $('#spinner').empty().hide();
          $('.loading-message').html('Connection failed');
          $('.button-try-again').removeData().attr('data-vendor-guid', vendor.guid).attr('data-contract-id', contract.id).attr('data-view', "contract").show();
        }
      }, delay);

    }
  }
}