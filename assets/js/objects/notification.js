$(function() {
  window.Notification.initialize();
});

window.Notification = {
  initialize: function(){
    $(document).on("click", ".menu-notifications", function(){ Notification.view() });
  },

  view: function view(){
    Notification.load();
    Helper.hideAll();
    $('.notification-count').hide();
    Page.setColors(User.find($session.handle));      
    Navigation.setPageUrl($session.handle + '/notifications');
    $('.notifications').fadeTo(100,100).show();
  },

  load: function load(){
    $('.notifications-body table').empty();

    _.each(window.preloadData.notifications, function(notification){
      user = User.find(notification.user);
      message = Notification.message(notification, user);
      if (notification.viewed){
        viewed = "notification-viewed";
      }else{
        viewed = "";
      }

      $('.notifications-body table').append('<tr class="notification-detail border-secondary-color ' + viewed + '" data-id="' + notification['id'] + '" style="margin-bottom:6px"><td class="border-secondary-color"><div class="avatar position-float-left" style="background: url(' + user['avatar'] + ') 50% 50% / cover no-repeat"></div><div class="position-float-left position-margin-left-10px position-margin-top-5px">' + message + '<div class="position-margin-top-2px type-weight-light type-opacity-75">' + notification['date'] + '</div></div></td></tr>');
    });
  },

  message: function message(notification, user){
    switch(notification.type){
      case "dispute":
        return '<span class="user-page-link" data-user-handle="' + user.handle + '">' + user.handle + '</span> <span class="type-weight-light">responded to a dispute regarding </span> <span class="order-page-link" data-sale-id="' + notification['sale-id'] + '">' + notification.item + '</span>';
        break;
      case "order":
        return '<span class="user-page-link" data-user-handle="' + user.handle + '">' + user.handle + '</span> <span class="type-weight-light">placed an order for</span> <span class="order-page-link" data-sale-id="' + notification['sale-id'] + '">' + notification.item + '</span>';
        break;
    }
  }
}