$(function() {
  window.Discover.initialize();
});

window.Discover = {
  initialize: function(){
    $(document).on("click", ".discover-navigation-vendors", function(){ Discover.vendors() });
    $(document).on("click", ".discover-navigation-contracts", function(){ Discover.contracts(false, true) });
  },

  contracts: function contracts(updatePageViews, backwards){
    if (updatePageViews){
      pageViews.push({"page": "home", "active": true});
      Navigation.unsetActivePage();
    }
    Helper.hideAll();
    $('.ob-icon').show();
    $('.discover-navigation-vendors').removeClass('user-page-navigation-selected');
    $('.discover-navigation-contracts').addClass('user-page-navigation-selected');

    if (backwards){
      $('.loading-icon').hide();
      $('.loading-message').html(_.shuffle(window.preloadData.messages)[0]);
      $('.connecting').fadeIn();
      Connect.load();
      setTimeout(function(){
        Discover.populateFeed();
        $('.connecting').hide();
        $('.discover').fadeIn('fast');
      }, 1000);
    }else{
      $('.loading-message').html('Connecting to stores...');
      $('.loading-icon').hide();
      $('.connecting').fadeIn();
      Connect.load();
      setTimeout(function(){
        Discover.populateFeed();
      }, delay);
    }
    Helper.setDefualtColors(false);
  },

  vendors: function vendors(){
    $('.discover-contracts').hide();
    $('.discover-vendors').show();
    $('.discover-navigation-contracts').removeClass('user-page-navigation-selected');
    $('.discover-navigation-vendors').addClass('user-page-navigation-selected');
    $('.discover-vendor-search').focus();
    $('.discover-vendors-list').empty();
    _.each(_.shuffle(window.preloadData.users), function(user){
      // if(user.roles.toString().includes("vendor")){
        $('.discover-vendors-list').append('<tr><td><div class="avatar position-float-left position-margin-right-10px user-page-link" data-user-handle="' + user.handle + '" style="background: url(' + user.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-9px "><div class="user-page-link" data-user-handle="' + user.handle + '">' + user.name + '</div><div class="user-page-link" data-user-handle="' + user.handle + '">' + user.handle + '</div></div></td><td class=""><button class="button-primary position-float-right follow-user" data-user-handle="' + user.handle + '">Follow</button></td></tr>');
      // }
    });
    Helper.setDefualtColors(true);
  },

  populateFeed: function populateFeed(){
    $('.connecting').hide();
    $('.discover-vendors').hide();
    $('.discover, .discover-contracts').show();
    _.each(_.shuffle(window.preloadData.users), function(user){
      _.each(_.shuffle(user.contracts), function(contract){
        Contract.renderGridContract(user, contract, '.discover-contracts');
      });
    });
  }
}
