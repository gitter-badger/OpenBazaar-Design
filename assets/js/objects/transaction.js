$(function() {
  window.Transaction.initialize();
});

window.Transaction = {
  initialize: function() {
    $(document).on("click", ".order-page-link", function(event){ 
      var id = $(event.currentTarget).attr('data-sale-id');
      Helper.hideAll();
      Sale.display();
      Transaction.renderDetails(id, "sale");
    });
    $(document).on("click", ".transactions li", function(event){ Transaction.changeType(event) });
    $(document).on("click", ".transaction-detail", function(event){ 
      Transaction.renderDetails($(event.currentTarget).data('id'), $(event.currentTarget).data('transactionType'));
    });
    $(document).on("click", ".release-funds-to", function(event){ Transaction.releaseFunds(event) });
    $(document).on("click", ".modal-purchase-release-funds-to-buyer", function(event){ Transaction.releaseFundsToBuyer() });
    $(document).on("click", ".modal-purchase-release-funds-to-seller", function(event){ Transaction.releaseFundsToSeller() });
  },

  changeType: function changeType(event){
    $('.transactions li').removeClass('user-page-navigation-selected');
    $(event.currentTarget).addClass('user-page-navigation-selected');
    
    switch($(event.currentTarget).attr('data-section')){
      case "purchases":
        Purchase.display();
        break;
      case "sales":
        Sale.display();
        break;
      case "cases":
        Case.display();
        break;
    }

    $(".transactions-order-search").focus();
  },

  releaseFunds: function releaseFunds(){
    if (confirm('Are you sure you want to relase ' + $('.release-funds-amount').val() + 'btc to the '+  $(".refund-to option:selected").val() +' ?') == true) {
      new Notification($('.release-funds-amount').val() + 'btc released to the ' + $(".refund-to option:selected").val());     
    }
  },

  releaseFundsToBuyer: function releaseFundsToBuyer(){
    if (confirm("Are you sure you want to relase the funds to the buyer?") == true) {
      new Notification('Payment released to the buyer');     
      $('.modal-footer').hide();   
    }
  },

  releaseFundsToSeller: function releaseFundsToSeller(){
    if (confirm("Are you sure you want to relase the funds to the seller?") == true) {
      new Notification('Payment released to the seller');        
      $('.modal-footer').hide();   
    }
  },

  renderDetails: function renderDetails(id, type){
    var purchaseId = id;
    var purchase = _.find(window.preloadData.purchases, function(purchase){ return purchase.id == purchaseId });

    if (purchase.tracking != ""){
      var status = purchase.status + ": " + purchase.tracking;
    }else{
      var status = purchase.status;
    }

    $('.modal-navigation ul li').removeClass('modal-navigation-selected');
    $('.modal-navigation ul li:first').addClass('modal-navigation-selected');
    $('.modal-purchase-detail-summary, .modal-purchase-detail-shipping, .modal-purchase-detail-payment, .modal-purchase-detail-settings, .modal-purchase-detail-dispute').hide();
    $('.modal-purchase-detail-summary').show();

    $('#main, .vendor-header').addClass('blur');
    $('.modal-trade-flow').hide();
    $('.modal-purchase-dispute').attr('data-mod-guid', purchase['mod-guid'])
    $('.modal-mod-name').html(purchase['mod'])
    $('.modal-vendor-name').html(purchase.vendor);
    $('.modal-contract-name').html(purchase['contract-name']);
    $('.modal-transaction-id').html('ID: ' + purchase['id']);
    $('.modal-buyer-address').html(purchase['buyer-address']);
    $('.modal-photo-shadow, .modal-contract-price-style').show();
    $('.modal-contract-price').html(purchase['price']);
    $('.modal-mod-price').html(purchase['mod-fee']);
    $('.modal-shipping-price').html(purchase['shipping']);
    $('.modal-puchase-date').html(purchase['date']);
    $('.modal-mod-avatar').css('background', 'url(' + purchase['mod-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-buyer-avatar').css('background', 'url(' + purchase['buyer-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-vendor-avatar').css('background', 'url(' + purchase['vendor-avatar'] + ') 50% 50% / cover no-repeat');
    $('.modal-purchase-detail .modal-transaction-price').html(status);
    $('.modal-purchase-detail .modal-photo').css('background', 'url(' + purchase['contract-image'] + ') 50% 50% / cover no-repeat');
    $('.overlay, .modal-purchase-detail').show();
    $('.modal-pretty').fadeTo(100, 100);

    switch(type){
      case "purchase":
        $('.modal-purchase-release-funds').show();
        $('.modal-purchase-request-funds').hide();
        $('.modal-navigation ul li:nth-child(4)').hide();
        break;
      case "sale":
        $('.modal-purchase-release-funds').hide();
        $('.modal-purchase-request-funds').show();
        $('.modal-navigation ul li:nth-child(4)').show();
        break;
      case "case":
        $('.modal-purchase-dispute, .modal-purchase-request-funds').hide();
        $('.modal-purchase-release-funds-to-buyer, .modal-purchase-release-funds-to-seller').show();
        $('.modal-navigation ul li:nth-child(4)').show();
        Case.loadDispute(id);
        break;
    }

    Page.setColors(User.find($session.handle));   
  }
}