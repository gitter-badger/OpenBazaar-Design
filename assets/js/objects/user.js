$(function() {
  window.User.initialize();
});

window.User = {
  initialize: function() {
    $(document).on("click", ".menu-user-profile, .user-profile-link", function(event){
      var handle = $(event.currentTarget).attr('data-user-handle');
      var user = User.find(handle);
      User.view(user, true);
    });
    $(document).on("click", ".user-profile-navigation li", function(event){ User.changeSection(event) });
  },

  find: function find(handle){
    return _.find(window.preloadData.users, function(user){ return user.handle == handle });
  },

  findById: function findById(id){
    return _.find(window.preloadData.users, function(user){ return user.id == id });
  },

  findByGuid: function findByGuid(guid){
    return _.find(window.preloadData.users, function(user){ return user.guid == guid });
  },

  changeSection: function changeSection(event){
    $('.user-profile-navigation li').removeClass('user-profile-navigation-selected');
    $(event.currentTarget).addClass('user-profile-navigation-selected');
    var section = $(event.currentTarget).attr('data-section');
    var handle = $(event.currentTarget).attr('data-user-handle');
    var user = User.find(handle);

    switch(section){
      case "user-profile-about":
        $('.user-profile-following').hide();
        $('.user-profile-about, .user-social').show();
        break;
      case "user-profile-following":
        User.loadFollowing(user);
        $('.user-profile-about, .user-social').hide();
        $('.user-profile-following').show();
        break;
    }

    User.setPrimaryColor(user.colorprimary);
    User.setSecondaryColor(user.colorsecondary);
    User.setTextColor(user.colortext);
    User.setBackgroundColor(user.colorbackground);
    $('.user-profile-navigation li:not(.user-profile-navigation-selected)').css('background', user.colorsecondary);
  },

  loadFollowing: function loadFollowing(user){
    $('.user-profile-following').empty();
    _.each(user.following, function(person, index){
      $('.user-profile-following').append('<tr><td><div class="avatar position-float-left position-margin-right-10px" style="background: url(' + person.avatar + ') 50% 50% / cover no-repeat"></div> <div class="position-float-left position-margin-top-19px user-profile-link" data-user-handle="' + person.handle + '">' + person.handle + '</div></td><td class=""><button class="button-primary position-float-right follow-user" data-user-handle="' + user.handle + '">Follow</button></td></tr>');
    });
  },

  view: function view(user, updatePageViews){
    if (updatePageViews){
      pageViews.push({"page": "user", "id": user.id, "handle": user.handle, "active": true});
      Navigation.unsetActivePage();
      Navigation.stripPageHistory();
      Navigation.setArrowOpacity();
    }
    $('.user-profile-following').empty();
    User.setPrimaryColor(user.colorprimary);
    User.setSecondaryColor(user.colorsecondary);
    User.setTextColor(user.colortext);
    Helper.hideAll();
    $('.user-profile-navigation li:not(.user-profile-navigation-selected)').css('background', user.colorsecondary);
    $('.input-search').val(user.handle);
    $('.user-profile-navigation ul li, .user-profile-message').attr('data-user-handle', user.handle);
    $('.user-name').html(user.name)
    $('.user-details-website').html('<a href="' + user.website + '" target="_blank">' + user.website + '</a>');
    $('.user-details-email').html(user.email);
    $('.user-profile-photo').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    $('.user-profile-avatar').css('background', 'url(' + user.avatar + ') 50% 50% / cover no-repeat');
    // $('.user-profile-about p').html(user.description);
    $('.user-profile-name').html(user.handle);
    $('.user-profile').fadeIn('slow');
  }

}
