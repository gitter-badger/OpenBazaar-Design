$(function() {
  window.Purchase.initialize();
});

window.Purchase = {
  initialize: function() {
  },

  display: function display(){
    Purchase.load();
    Helper.hideAll();
    $('.transactions-sales, .transactions-cases').hide();
    $('.transactions').fadeTo(100, 100);
    $('.transactions-purchases').show();
    $('.transactions-navigation-purchases').addClass('user-page-navigation-selected');
    Helper.setDefualtColors(true);
    $('.transactions-order-search').focus();
  },

  load: function load(){
    $('.transactions .transactions-purchases tbody').empty();

    _.each(window.preloadData.purchases, function(purchase){ 
      $('.transactions .transactions-purchases tbody').append('<tr class="transaction-detail" data-id="' + purchase['id'] + '" data-transaction-type="purchase"><td>' + purchase['id'] + '</td><td><div class="avatar purchase-contract position-float-left" style="background: url(' + purchase['contract-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-contract position-margin-top-15px position-margin-left-8px">' + purchase['contract-name'] + '</div></td><td><div class="avatar position-float-left" style="background: url(https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTPH-XfXxbxMTizvaNTCZuugMAQeOErj8-7DcjloR9MgBAw6xxuQQ) 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 contract-store-name user-page-link" data-user-handle="' + purchase['vendor'] + '" data-store-guid="' + purchase['guid'] + '">' + purchase['vendor'] + '</div></td><td>' + purchase['date'] + '</td><td>' + purchase['price'] + '</td><td>' + purchase['status'] + '</td></tr>');
    });
  },
}