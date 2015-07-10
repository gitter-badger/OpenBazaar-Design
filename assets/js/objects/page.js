$(function() {
  window.Page.initialize();
});

window.Page = {
  initialize: function() {
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
  },

  hideSections: function hideSections(){  
    $('.user-page-details, .user-page-contracts, .user-page-services, .user-page-following, .user-page-followers, .user-page-contract-detail').hide();
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
    $('.user-details-website').html('<a href="' + user.website + '" target="_blank">' + user.website + '</a>');
    $('.user-details-email').html(user.email);
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
        break;
      case "vendor":
        $('.user-page-contracts-grid').empty();
        _.each(user.contracts, function(contract, index){
          Contract.renderGridContract(user, contract, '.user-page-contracts-grid');
        });    
        $('.user-page-navigation-store').show();
        $('.user-page-contracts').show();
        $('.user-page-navigation-store').addClass('user-page-navigation-selected');
        break;
      case "moderator":
        break;
      case "moderator,vendor":
        break;
    }
  },

  setPrimaryColor: function setPrimaryColor(hex){  
    hex = hex.replace('#','');
    $('.user-page, .contract-detail, .navigation-controls, .pod, .pill, .user-page-navigation-selected, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .modal, .modal-pretty, .modal-body, .user-page-avatar').css('background-color', '#' + hex);
    $('.user-configuration-primary-color').css('background-color', '#' + hex);
    $('.modal-pretty button.button-first').css('border-right-color', '#' + hex);
    $('.user-page-navigation').css('border-color', '#' + hex);
    $('.user-page-navigation ul li ').css('border-right-color', '#' + hex);
    $store.colorprimary = '#' + hex;
  },

  setSecondaryColor: function setSecondaryColor(hex){  
    hex = hex.replace('#','');
    $('#header, .user-page-navigation, .transactions table thead tr, .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .user-page-navigation-selected .pill').css('background-color', '#' + hex);
    $('.modal-pretty table td').css('border-bottom-color', '#' + hex);
    $('.pod').css('border-right-color', '#' + hex);
    $('.user-page td, .user-page-contracts .contract, .user-page-breadcrumb').css('border-color', '#' + hex);
    $store.colorsecondary = '#' + hex;
  },

  setBackgroundColor: function setBackgroundColor(hex){  
    hex = hex.replace('#','');
    $('body').css('background-color', '#' + hex);
  },

  setTextColor: function setTextColor(hex){  
    hex = hex.replace('#','');
    $('body, .navigation-controls, .navigation-controls span, .control-panel li, .button-primary, .user-configuration-primary-color, .contract-meta-data, .modal input, .modal select, .modal textarea, .modal-pretty input, .modal-pretty select, .modal-pretty textarea, .modal-pretty button').css('color',  '#' + hex);
    $('.user-configuration-font-color').css('background-color', '#' + hex);
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

   view: function view(user, updatePageViews){
    if (updatePageViews){
      pageViews.push({"page": "user", "id": user.id, "handle": user.handle, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    $('.chat').show();
    Helper.hideAll();
    Page.hideSections();
    Page.setActiveTab(event);
    Page.setNavigation(user);
    Page.setColors(user);
    Page.setMetaData(user);
    Navigation.setPageUrl(user.handle);
    $('.user-page').fadeIn('slow');
  }, 

  about: function about(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    Page.setColors(user)
    $('.user-page-details').show();
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
  },

  contract: function contract(user, contract){
    $('.user-page-navigation ul li').removeClass('user-page-navigation-selected');
    $('.user-page-navigation ul li').css('background-color', 'transparent');
    $('.user-page-contract-detail-name').html(contract.name);
    $('.user-page-contract-detail-image').css('background', 'url(' + contract.photo1 + ') 50% 50% / cover no-repeat');
    $('.user-page-contract-detail-price').html('$23.52 (' + contract.price + ' btc)');
    $('.user-page-contract-detail-shipping').html(contract.shipping);
    $('.user-page-contract-detail-condition').html(contract.condition);
    $('.user-page-contract-detail-type').html(contract.type);
    $('.user-page-contract-detail-description').html(contract.description);
    Page.setMetaData(user);
    Page.setNavigation(user);
    Page.setColors(user);
    Page.hideSections();
    $('.user-page-contract-detail').show();
    $('.user-page').fadeIn('slow');

  },

  followers: function followers(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-followers-list').empty();
    _.each(user.followers, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-followers-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-followers').show();
  },

  following: function following(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-following-list').empty();
    _.each(user.following, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-following-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-following').show();
  }
}