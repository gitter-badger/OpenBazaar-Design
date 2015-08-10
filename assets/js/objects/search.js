$(function() {
  window.Search.initialize();
});

window.Search = {
  initialize: function() {
  },

  find: function find(){
    if($('.input-search').val().includes('@') && $('.input-search').val().includes(' ')){
      var handle = $('.input-search').val().split(" ")[0];
      var keyword = $('.input-search').val().split(" ")[1];
      Search.byHandleAndKeyword(handle,keyword);
    }else if($('.input-search').val().includes('@') && $('.input-search').val().includes('?edit')){
      Search.byHandleEditMode($('.input-search').val());
    }else if($('.input-search').val().includes('@')){
      Search.byHandle($('.input-search').val());
    }else if($('.input-search').val() === ''){
      Discover.contracts(true, false);
      Navigation.setPageUrl();
    }else{
      Search.byKeyword($('.input-search').val());
    }
  },

  byHandle: function byHandle(handle, instant){
    var user = User.find(handle.trim());
    if(user){
      Navigation.setPageUrl(user.handle);
      Page.view(user, true, instant);
    }
  },

  byHandleEditMode: function byHandleEditMode(handle, instant){
    var user = User.find(handle.replace('/edit','').trim());
    if(user){
      Navigation.setPageUrl(user.handle + '/edit');
      Page.view(user, true, instant);
    }
  },

  byHandleAndKeyword: function byHandle(handle,keyword){
    var user = User.find(handle);
    if(user){
      Page.view(user, true);
      Navigation.setPageUrl(user.handle);
      $('.search-store').val(keyword);
    }
  },

  byKeyword: function byKeyword(keyword){
    pageViews.push({"page": "search", "keywords": keyword, "active": true});
    Navigation.unsetActivePage();
    $('.store').hide();
    $('.items').empty();
    $('.loading-message').html('Searching for "' + keyword + '"');
    $('.connecting').fadeIn();
    $('.item').fadeTo(0, 0);
    Connect.load();
    Helper.setDefualtColors(false);
    setTimeout(function(){  
      Discover.contracts(false, false);
    }, delay);
  },

  convertToHandle: function convertToHandle(text){
    return text.replace('ob://@', '@');
  },

  convertToUrl: function convertToUrl(text){
    return text.replace('@', 'ob://@');
  }
}