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

  find: function find(id){
    return _.find(window.preloadData.cases, function(cases){ return cases.id == id });
  },

  load: function load(){
    $('.transactions .transactions-cases tbody').empty();

    _.each(window.preloadData.cases, function(c){ 
      $('.transactions .transactions-cases tbody').append('<tr class="transaction-detail border-secondary-color" data-id="' + c['id'] + '" data-transaction-type="case"><td>' + c['id'] + '</td><td>' + c['date'] + '</td><td><div class="avatar position-float-left" style="background: url(' + c['buyer-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-10px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['buyer-handle'] + '</div></td><td><div class="avatar position-float-left" style="background: url(' + c['vendor-avatar'] + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-10px position-margin-left-8px position-padding-top-0 contract-store-name" data-store-guid="' + c['guid'] + '">' + c['vendor'] + '</div></td><td>' + c['status'] + '</td></tr>');
    });
  },

  loadDispute: function loadDispute(id){
    var cases = Case.find(id);
    $('.modal-purchase-detail-dispute table').empty();
    if (cases.dispute){
      _.each(cases.dispute, function(c){ 
        user = User.find(c.user);
        $('.modal-purchase-detail-dispute table').append('<tr class="border-secondary-color"><td style="padding: 10px; width: 40px"><div class="avatar" style="background: url(' + user.avatar + ') 50% 50% / cover no-repeat"></div></td><td class="position-padding-left-0"><div class="type-weight-medium"><span class="user-page-link" data-user-handle="' + user.handle + '">' + user.handle + '</span> said on ' + c.date + '</div><div>' + c.message + '</div></td></tr>').show();
      });
      $('.modal-purchase-detail-dispute-empty').hide();
      $(".modal-purchase-detail-dispute div").scrollTop($(".modal-purchase-detail-dispute div")[0].scrollHeight);
    }else{
      $('.modal-purchase-detail-dispute-empty').show();
    }
  },

  disputeMessage: function disputeMessage(){
    $('.modal-purchase-detail-dispute table').append('<tr class="border-secondary-color"><td style="padding: 10px; width: 40px"><div class="avatar" style="background: url(' + $session.avatar + ') 50% 50% / cover no-repeat"></div></td><td class="position-padding-left-0"><div class="type-weight-medium"><span class="user-page-link" data-user-handle="' + $session.handle + '">' + $session.handle + '</span> just now</div><div>' + $('.input-dispute-message').val() + '</div></td></tr>').show();  
    $('.input-dispute-message').val('');
    $('.modal-purchase-detail-dispute-empty').hide();
    $(".modal-purchase-detail-dispute div").scrollTop($(".modal-purchase-detail-dispute div")[0].scrollHeight);
    Page.setColors(User.find($session.handle));   
  }
} 