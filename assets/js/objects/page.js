$(function() {
  window.Page.initialize();
});

window.Page = {
  initialize: function() {
    $(document).on("click", ".trade-back-to-payment", function(){ Page.tradeBackToPayment() });
    $(document).on("click", ".trade-back-to-address", function(){ Page.tradeBackToAddress() });
    $(document).on("click", ".modal-qr-code", function(){ Page.tradeConfirmed() });
    $(document).on("change", ".input-user-page-header", function(){ 
      var input = this;
      var reader = new FileReader();
      reader.onload = function (e) {
        $('.user-page-header').css('background', 'url(' + e.target.result + ') 50% 50% / cover no-repeat');
      }
      reader.readAsDataURL(input.files[0]);
    });
    $(document).on("mouseenter", ".user-page-header", function(){ 
      if($('.input-search').val().includes('/edit')){
        $('#button-user-page-header').fadeTo(100, .80);
      }
    });
    $(document).on("mouseleave", ".user-page-header", function(){ 
      if($('.input-search').val().includes('/edit')){
        $('#button-user-page-header').fadeTo(100, 0);
      }
    });
    $(document).on("click", "#button-user-page-header", function(){ 
      if($('.input-search').val().includes('/edit')){
        $('.input-user-page-header').click();
        $('#button-user-page-header').fadeTo(100, .80);
      }
    });
    $(document).on("click", ".trade-done", function(){ Page.tradeDone() });
    $(document).on("mouseenter", ".user-page-configuration-preset", function(){ 
      Page.setPrimaryColor('#222');
      Page.setSecondaryColor('#432');
      Page.setBackgroundColor('#342432');
      Page.setTextColor('#f0f0f0');    
    });
    $(document).on("mouseleave", ".user-page-configuration-preset", function(){ 
      var user = User.find($session.handle);
      Page.setColors(user); 
    });
    $(document).on("click", ".menu-user-profile", function(event){
      var handle = $(event.currentTarget).attr('data-user-handle').replace('/edit','').trim();
      Search.byHandleEditMode(handle, true);
      Navigation.setPageUrl(handle + '/edit');
    });
    $(document).on("click", ".user-page-configuration-edit", function(event){
      var handle = $(event.currentTarget).attr('data-user-handle').replace('/edit','').trim();
      Search.byHandleEditMode(handle, true);
      Navigation.setPageUrl(handle + '/edit');
    });
    $(document).on("click", ".user-profile-navigation li", function(event){ User.changeSection(event) });
    $(document).on("click", ".user-page-configuration-cancel", function(){ 
      Search.byHandle($('.input-search').val().replace('/edit',''), true);
    });
    $(document).on("click", ".user-page-configuration-save", function(){ 
      $(this).html('Saving...');
      var user = User.find($(this).attr('data-user-handle'));
      Page.save(user);
      setTimeout(function() {
        $('.user-page-configuration-save').html('Save changes');
        new Notification("Changes saved. Your page has been updated");
        Navigation.setPageUrl(user.handle);
        Page.view(user, false, true);
      }, 500);
    });
    $(document).on("click", ".contract-vendor-name", function(event) { 
      event.stopPropagation();
      var guid = $(event.currentTarget).attr('data-vendor-guid');
      Page.view(User.findByGuid(guid), true);
      Page.setActiveTab();
      $('.vendor-home').addClass('vendor-navigation-selected');
    });
    $(document).on("click", ".item-vendor-name, .vendor-header .vendor-name, .vendor-header .vendor-avatar, .vendor-home", function(event) { 
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
      Page.displayContracts(Page.find(vendorGuid), true, false);
    });
    $(document).on("click", ".user-page-navigation-followers", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.followers(user, event) 
    });
    $(document).on("click", ".user-page-navigation-following", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.following(user, event) 
    });
    $(document).on("click", ".user-page-navigation-about", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.about(user, event) 
    });
    $(document).on("click", ".user-page-navigation-store", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.store(user, event) 
    });
    $(document).on("click", ".user-page-link, .contract-vendor-avatar", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.view(user, event) 
    });
    $(document).on("click", ".follow-user", function(event){ 
      if($(this).html() === "Follow"){
        new Notification('You\'re now following ' + $(event.currentTarget).attr('data-user-handle'));
        $(this).html('Unfollow');
      }else{
        new Notification('You\'re no longer following ' + $(event.currentTarget).attr('data-user-handle'));
        $(this).html('Follow');
      }
    });
    $('.user-page-configuration-primary-color').ColorPicker({
      color: defaultPrimaryColor,
      onChange: function (hsb, hex, rgb) {
        Page.setPrimaryColor(hex);
      } 
    });
    $('.user-page-configuration-secondary-color').ColorPicker({
      color: defaultSecondaryColor,
      onChange: function (hsb, hex, rgb) {
        Page.setSecondaryColor(hex);
      } 
    });
    $('.user-page-configuration-text-color').ColorPicker({
      color: defaultTextColor,
      onChange: function (hsb, hex, rgb) {
        Page.setTextColor(hex);
      } 
    });
    $('.user-page-configuration-background-color').ColorPicker({
      onChange: function (hsb, hex, rgb) {
        Page.setBackgroundColor(hex);
      } 
    });
  },

  hideSections: function hideSections(){  
    $('.user-page-details, .user-page-contracts, .user-page-services, .user-page-following, .user-page-followers, .user-page-contract-detail').hide();
  },

  save: function save(user){
    for (var i = 0, l = window.preloadData.users.length; i < l; i++) {
      if (window.preloadData.users[i].handle === user.handle) {
        var row = window.preloadData.users[i];
        row.colorprimary = Helper.colorToHex($('.user-page-configuration-primary-color').css('background-color'));
        row.colorsecondary = Helper.colorToHex($('.user-page-configuration-secondary-color').css('background-color'));
        row.colorbackground = Helper.colorToHex($('.user-page-configuration-background-color').css('background-color'));
        row.colortext = Helper.colorToHex($('.user-page-configuration-text-color').css('background-color'));
        row.description = $('.input-user-configuration-about').val();
        row.website = $('.input-user-configuration-website').val();
        row.email = $('.input-user-configuration-email').val();
        row.facebook = $('.input-user-configuration-facebook').val();
        row.twitter = $('.input-user-configuration-twitter').val();
        row.instagram = $('.input-user-configuration-instagram').val();
        break;
      }
    }
  },

  setActiveTab: function setActiveTab(event){
    $('.user-page-navigation ul li').removeClass('user-page-navigation-selected');
    $('.user-page-navigation ul li').css('background-color', 'transparent');
    $(event.currentTarget).addClass('user-page-navigation-selected');
  },

  setColors: function setColors(user){
    Page.setPrimaryColor(user.colorprimary);
    Page.setSecondaryColor(user.colorsecondary);
    Page.setBackgroundColor(user.colorbackground);
    Page.setTextColor(user.colortext);
  },

  setMetaData: function setMetaData(user){
    $('.user-page-navigation ul li, .user-page-message, .user-page-navigation-store').attr('data-user-handle', user.handle);
    $('.user-page-name').html(user.name);
    $('.user-page-follow').attr('data-user-handle', user.handle);
    $('.user-page .button-primary, .user-page-configuration-edit').attr('data-user-handle', user.handle);
    $('.user-page-details-website').html('<a href="' + user.website + '" target="_blank">' + user.website + '</a>');
    if (user.email){ $('.user-page-details-email').html(user.email); }else{ $('.user-page-details-email').html('not provided'); }
    if (user.facebook){ $('.user-page-details-facebook').html(user.facebook); }else{ $('.user-page-details-facebook').html('not provided'); }
    if (user.twitter){ $('.user-page-details-twitter').html(user.twitter); }else{ $('.user-page-details-twitter').html('not provided'); }
    if (user.instagram){ $('.user-page-details-instagram').html(user.instagram); }else{ $('.user-page-details-instagram').html('not provided'); }
    if (user.website){ $('.user-page-details-website').html(user.website); }else{ $('.user-page-details-website').html('not provided'); }
    $('.input-user-configuration-website').val(user.website);
    $('.input-user-configuration-email').val(user.email);
    $('.input-user-configuration-twitter').val(user.twitter);
    $('.input-user-configuration-facebook').val(user.facebook);
    $('.input-user-configuration-instagram').val(user.instagram);
    $('.input-user-configuration-about').val(user.description);
    $('.user-page-header').css('background', 'url(' + user.hero + ') 50% 50% / cover no-repeat');
    $('.user-page-avatar').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    $('.user-page-about p').html(user.description);   
  },

  setNavigation: function setNavigation(user){  
    $('.user-page-navigation ul li').removeClass('user-page-navigation-selected');
    $('.user-page-navigation ul li').css('background-color', 'transparent');
    $('.user-page-followers-count').html(user.followers.length);
    $('.user-page-following-count').html(user.following.length);
    $('.user-page-contracts-count').html(user.contracts.length);

    switch(user.roles.join(",")){
      case "":
        $('.user-page-navigation-store').hide();
        $('.user-page-navigation-about').addClass('user-page-navigation-selected');
        $('.user-page-details').show();
        // Navigation.setPageUrl(user.handle + '/about');
        break;
      case "vendor":
        $('.user-page-contracts-grid').empty();
        _.each(user.contracts, function(contract, index){
          Contract.renderGridContract(user, contract, '.user-page-contracts-grid');
        });    
        $('.user-page-navigation-store').show();
        $('.user-page-contracts').show();
        $('.user-page-navigation-store').addClass('user-page-navigation-selected');
        // Navigation.setPageUrl(user.handle + '/store');
        break;
      case "moderator":
        break;
      case "moderator,vendor":
        break;
    }
  },

  setPrimaryColor: function setPrimaryColor(hex){  
    hex = hex.replace('#','');
    $('.user-page, .contract-detail, .navigation-controls, .pod, .pill, .user-page-navigation-selected, .user-page-details-navigation-selected, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .modal, .modal-pretty, .modal-body, .user-page-avatar, .user-page-configuration-primary-color, .user-page input, .user-page textarea, .transactions-body, .settings-body').css('background-color', '#' + hex);
    $('.user-configuration-primary-color').css('background-color', '#' + hex);
    $('.modal-pretty button.button-first').css('border-right-color', '#' + hex);
    $('.user-page-navigation ul li, .user-page-details-navigation ul li ').css('border-right-color', '#' + hex);
    $store.colorprimary = '#' + hex;
  },

  setSecondaryColor: function setSecondaryColor(hex){  
    hex = hex.replace('#','');
    $('#header, .user-page-following-list .button-primary, .user-page-followers-list .button-primary, .user-page-footer, .discover-footer, .user-page-navigation, .user-page-details-navigation, .user-page-contract-detail-pricing, .transactions table thead tr, .modal-footer, .modal-footer button, .modal-header, .modal input, .modal select, .modal textarea, .user-page-navigation-selected .pill, .user-page-configuration-secondary-color').css('background-color', '#' + hex);
    $('.modal-pretty table td').css('border-bottom-color', '#' + hex);
    $('.pod').css('border-right-color', '#' + hex);
    $('.user-page-navigation, .user-page-details-navigation, .user-page input, .user-page textarea, .list-input-search').css('border-color', '#' + hex);
    $('.user-page td, .user-page-contracts .contract, .user-page-breadcrumb, .user-page-contract-detail-description, .list-input, .list-view tr').css('border-color', '#' + hex);
    $store.colorsecondary = '#' + hex;
  },

  setBackgroundColor: function setBackgroundColor(hex){  
    hex = hex.replace('#','');
    $('body, .user-page-configuration-background-color').css('background-color', '#' + hex);
  },

  setTextColor: function setTextColor(hex){  
    hex = hex.replace('#','');
    $('.user-page-navigation, .user-page-details, .user-page-social, .user-page a, .user-page-following, .user-page-followers, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .contract-meta-data, .modal input, .modal select, .modal textarea, .modal-pretty input, .modal-pretty select, .modal-pretty textarea, .modal-pretty button, .user-page input, .user-page textarea').css('color',  '#' + hex);
    $('.user-configuration-font-color, .user-page-configuration-text-color').css('background-color', '#' + hex);
    $store.colortext = '#' + hex;
  },

  tradeBackToPayment: function tradeBackToPayment(){
    Modal.setTitle('Payment type');
    $('.modal-trade-flow-address').hide();
    $('.modal-trade-flow-payment-type').show();
  },

  tradeConfirmed: function tradeConfirmed(){
    $('.trade-pending').hide();
    $('.trade-done').show();
    $('.modal-qr-cost').html('Payment received!');
    new Notification('Payment received');
  },

  tradeBackToAddress: function tradeBackToAddress(){
    var image = $('.item-detail-image').css('background-image');
    Modal.setTitle('Ship to');
    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat'); 
    $('.modal-trade-flow-summary').hide();
    $('.modal-item-price-style, .modal-photo-shadow, .modal-trade-flow-address').show();
  },

   view: function view(user, updatePageViews, instant){
    Helper.hideAll();
    if (updatePageViews){
      pageViews.push({"page": "user", "id": user.id, "handle": user.handle, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }

    if($('.input-search').val().includes('/edit')){
      $('.user-page-configuration-colors, .user-page-social .input, .user-page-about .textarea, .user-page-actions-configuration').show();
      $('.user-page-actions-primary, .user-page-actions-self, .user-page-social .value, .user-page-about p').hide();
      $('#button-user-page-header').addClass('active');
    }else{
      $('.user-page-actions-primary, .user-page-social .value, .user-page-about p').show();
      $('.user-page-actions-configuration, .user-page-actions-self').hide();
      $('#button-user-page-header').fadeTo(0).removeClass('active');
      if(user.handle === $session.handle){
        $('.user-page-actions-self').show();
        $('.user-page-actions-configuration, .user-page-actions-primary').hide();
      }
    }
    $('.chat').show();
    Navigation.setPageUrl(user.handle);
    Page.hideSections();
    // Page.setActiveTab(event);
    Page.setNavigation(user);
    Page.setColors(user);
    Page.setMetaData(user);
    if(instant){
      $('.user-page').show();
    }else{
      $('.user-page').fadeIn('slow');
    }
    $('.search-store').focus();
    $('#main').scrollTop(0);
  }, 

  about: function about(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    Page.setColors(user)
    Navigation.setPageUrl(user.handle + '/about');
    $('.user-page-details').show();
    $('#main').scrollTop(0);
  },

  store: function store(user, event){
    Page.setNavigation(user);
    Page.hideSections();
    $('.user-page-contracts-grid').empty();
    _.each(user.contracts, function(contract, index){
      Contract.renderGridContract(user, contract, '.user-page-contracts-grid');
    });    
    Page.setColors(user)
    $('.user-page-contracts').show();
    $('.search-store').focus();
    Navigation.setPageUrl(user.handle + '/store');
  },

  contract: function contract(user, contract, updatePageViews){
    if (updatePageViews){
      pageViews.push({"page": "user", "id": user.id, "handle": user.handle, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    $('.user-page-navigation ul li').removeClass('user-page-navigation-selected');
    $('.user-page-navigation ul li').css('background-color', 'transparent');
    $('.user-page-contract-detail-name').html(contract.name);
    $('.user-page-contract-detail-image').css('background', 'url(' + contract.photo1 + ') 50% 50% / cover no-repeat');
    $('.user-page-contract-detail-price').html('$23.52 (' + contract.price + ' btc)');
    if (contract.shipping == 0){
      $('.user-page-contract-detail-shipping-row').hide();
    }else{
      $('.user-page-contract-detail-shipping').html(contract.shipping).show();
    }
    $('.user-page-contract-detail-condition').html(contract.condition);
    $('.user-page-contract-detail-type').html(contract.type);
    $('.user-page-contract-detail-description').html(contract.description);
    Page.setMetaData(user);
    Page.setNavigation(user);
    Page.setColors(user);
    Page.hideSections();
    $('.user-page-contract-detail').show();
    $('.user-page').fadeIn('slow');
    $('#main').scrollTop(0);
  },

  followers: function followers(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-followers-list').empty();
    _.each(user.followers, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-followers-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right follow-user" data-user-handle="' + person.handle + '">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-followers').show();
    $('.search-followers').focus();
    Navigation.setPageUrl(user.handle + '/followers');
  },

  following: function following(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-following-list').empty();
    _.each(user.following, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-following-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right follow-user" data-user-handle="' + user.handle + '">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-following').show();
    $('.search-following').focus();
    Navigation.setPageUrl(user.handle + '/following');
  },
  
  tradeBackToPayment: function tradeBackToPayment(){
    Modal.setTitle('Payment type');
    $('.modal-qr-payment').hide();
    $('.modal-contract-price').show();  
    $('.modal-trade-flow-payment-type').show();
  },

  tradeBackToAddress: function tradeBackToAddress(){
    var image = $('.user-page-contract-detail-image').css('background-image');
    Modal.setTitle('Ship to');
    $('.modal-qr-payment').hide();
    $('.modal-photo-shadow').show();
    $('.modal-contract-price').show();
    $('.modal-pretty .modal-photo').css('background', image + '50% 50% / cover no-repeat'); 
    $('.modal-trade-flow-summary').hide();
    $('.modal-item-price-style, .modal-photo-shadow, .modal-trade-flow-address').show();
  },

  tradeDone: function tradeDone(){
    Modal.close();
    new Notification('Thank you for shopping at ' + $('.user-page-name').html());
  }
}