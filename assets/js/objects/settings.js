$(function() {
  window.Settings.initialize();
});

window.Settings = {
  initialize: function() {
    $(document).on("click", ".menu-settings", function(event){
      Helper.hideAll();
      Page.setColors(User.find($session.handle));      
      Navigation.setPageUrl($session.handle + '/settings');   
      $('.settings').fadeTo(100,100).show();
    });
  }
}