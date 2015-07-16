$(function() {
  window.Sale.initialize();
});

window.Sale = {
  initialize: function() {
  },

  display: function display(){
    Sale.load();
    $('.transactions-purchases, .transactions-cases').hide();
    $('.transactions .transactions-sales').show();
  },

  load: function load(){
    $('.transactions .transactions-sales tbody').empty();

    _.each(window.preloadData.sales, function(sale){ 
      $('.transactions .transactions-sales tbody').append('<tr class="transaction-detail" data-id="' + sale['id'] + '" data-transaction-type="sale"><td>' + sale['id'] + '</td><td><div class="avatar purchase-contract position-float-left" style="background: url(' + sale['contract-image'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left purchase-contract position-margin-top-15px position-margin-left-8px">' + sale['contract-name'] + '</div></td><td><div class="avatar position-float-left" style="background: url(' + sale['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-15px position-margin-left-8px position-padding-top-0 item-store-name" data-buyer-guid="' + sale['buyer-guid'] + '">' + sale['buyer-handle'] + '</div></td><td>' + sale['date'] + '</td><td>' + sale['price'] + '</td><td>' + sale['status'] + '</td></tr>');
    });    
  },
}