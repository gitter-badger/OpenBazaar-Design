$(function() {
  window.Sale.initialize();
});

window.Sale = {
  initialize: function() {
  },

  display: function display(){
    Sale.load();
    Helper.hideAll();
    $('.transactions-purchases, .transactions-cases').hide();
    $('.transactions').fadeTo(0, 100);
    $('.transactions .transactions-sales').show();
    $('.user-page-navigation li').removeClass('user-page-navigation-selected');
    $('.transactions-navigation-sales').addClass('user-page-navigation-selected');
    Page.setColors(User.find($session.handle));   
    Navigation.setPageUrl($session.handle + '/sales');
    $('.transactions-order-search').focus(); 
  },

  load: function load(){
    $('.transactions .transactions-sales tbody').empty();

    _.each(window.preloadData.sales, function(sale){ 
      $('.transactions .transactions-sales tbody').append('<tr class="transaction-detail" data-id="' + sale['id'] + '" data-transaction-type="sale"><td>' + sale['id'] + '</td><td><div class="avatar purchase-contract position-float-left" style="background: url(' + sale['contract-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-contract position-margin-top-10px position-margin-left-8px">' + sale['contract-name'] + '</div></td><td><div class="avatar position-float-left" style="background: url(' + sale['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-10px position-margin-left-8px position-padding-top-0 item-store-name" data-buyer-guid="' + sale['buyer-guid'] + '">' + sale['buyer-handle'] + '</div></td><td>' + sale['date'] + '</td><td>' + sale['price'] + '</td><td>' + sale['status'] + '</td></tr>');
    });    
  },
}