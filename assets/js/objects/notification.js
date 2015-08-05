$(function() {
  window.Notification.initialize();
});

window.Notification = {
  initialize: function(){
    $(document).on("click", ".menu-notifications", function(){ Notification.view() });
  },

  view: function view(){
    Helper.hideAll();
    Page.setColors(User.find($session.handle));      
    Navigation.setPageUrl($session.handle + '/notifications');
    $('.notifications').fadeTo(100,100).show();
  }
}