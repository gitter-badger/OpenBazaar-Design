$(function() {
  window.Case.initialize();
});

window.Case = {
  initialize: function() {
  },

  display: function display(){
    Case.load();
    Helper.hideAll();
    $('.transactions-purchases, .transactions-sales').hide();
    $('.transactions').fadeTo(0, 100);
    $('.transactions .transactions-cases').show();
    $('.user-page-navigation li').removeClass('user-page-navigation-selected');
    $('.transactions-navigation-cases').addClass('user-page-navigation-selected');
    Page.setColors(User.find($session.handle));   
    Navigation.setPageUrl($session.handle + '/cases');   
    $('.transactions-order-search').focus(); 
  },

  load: function load(){
    $('.transactions .transactions-cases tbody').empty();

    _.each(window.preloadData.cases, function(c){ 
      $('.transactions .transactions-cases tbody').append('<tr class="transaction-detail border-secondary-color" data-id="' + c['id'] + '" data-transaction-type="case"><td>' + c['id'] + '</td><td>' + c['date'] + '</td><td><div class="avatar position-float-left" style="background: url(' + c['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-10px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['buyer-handle'] + '</div></td><td><div class="avatar position-float-left" style="background: url(' + c['vendor-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-10px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['vendor'] + '</div></td><td>' + c['status'] + '</td></tr>');
    });
  },
} 