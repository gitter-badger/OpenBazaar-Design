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
      Page.viewFollowers(user, event) 
    });
    $(document).on("click", ".user-page-navigation-following", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.viewFollowing(user, event) 
    });
    $(document).on("click", ".user-page-navigation-about", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.viewAbout(user, event) 
    });
    $(document).on("click", ".user-page-navigation-store", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.viewStore(user, event) 
    });
    $(document).on("click", ".user-page-link", function(event){ 
      var user = User.find($(event.currentTarget).attr('data-user-handle'));
      Page.view(user, event) 
    });
  },

  displayContracts: function displayContracts(vendor, updatePageViews, instant, autoConnect){  
    if (instant){ delay = 0; fade = 0; } else {  delay = 1900; fade = 500; }
    $('.contracts, .vendor-contracts-grid').empty();
    if (updatePageViews){
      pageViews.push({"page": "vendor", "guid": vendor.guid, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    _.each(vendor.contracts, function(contract, index){
      Contract.renderGridContract(vendor, contract, '.vendor-contracts-grid');
    });

    Helper.hideAll();
    Page.setSecondaryColor(vendor.colorsecondary);
    Page.setBackgroundColor(vendor.colorbackground);
    Page.setTextColor(vendor.colortext);
    Page.setPrimaryColor(vendor.colorprimary);
    $('.vendor-home').addClass('vendor-navigation-selected');
    $('.connecting').fadeIn();
    $('.loading-icon').attr('src', vendor.avatar).show();
    $('.vendor-message').attr('data-vendor-guid', vendor.guid);
    $('.loading-message').html('Connecting to ' + Page.handle(vendor));
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

  hideSections: function hideSections(){  
    $('.user-page-details, .user-page-contracts, .user-page-services, .user-page-following, .user-page-followers').hide();
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
    $('.user-page-navigation ul li, .user-page-message').attr('data-user-handle', user.handle);
    $('.user-page-name').html(user.name);
    $('.user-details-website').html('<a href="' + user.website + '" target="_blank">' + user.website + '</a>');
    $('.user-details-email').html(user.email);
    $('.user-page-header').css('background', 'url(' + user.hero + ') 50% 50% / cover no-repeat');
    $('.user-page-avatar').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    $('.user-page-about p').html(user.description);   
  },

  setNavigation: function setNavigation(user){  
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
    $('#header, .user-page-navigation, .transactions table thead tr, .modal-footer, .modal-header, .modal input, .modal select, .modal textarea, .dropzone').css('background-color', '#' + hex);
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
    Helper.hideAll();
    Page.hideSections();
    Page.setActiveTab(event);
    Page.setNavigation(user);
    Page.setColors(user);
    Page.setMetaData(user);
    $('.user-page').fadeIn('slow');
  }, 

  viewAbout: function viewAbout(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    Page.setColors(user)
    $('.user-page-details').show();
  },

  viewStore: function viewStore(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-contracts-grid').empty();
    $('.user-page-contracts-count').html(user.contracts.length);
    _.each(user.contracts, function(contract, index){
      Contract.renderGridContract(user, contract, '.user-page-contracts-grid');
    });    
    Page.setColors(user)
    $('.user-page-contracts').show();
  },

  viewFollowers: function viewFollowers(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-followers').empty();
    _.each(user.followers, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-followers').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-followers').show();
  },

  viewFollowing: function viewFollowing(user, event){
    Page.setActiveTab(event);
    Page.hideSections();
    $('.user-page-following').empty();
    _.each(user.following, function(userId, index){
      var person = User.findById(userId);
      $('.user-page-following').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-page-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right">Follow</button></td></tr>');
    });
    Page.setColors(user)
    $('.user-page-following').show();
  }
}