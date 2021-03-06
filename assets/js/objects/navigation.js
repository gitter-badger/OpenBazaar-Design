$(function() {
  window.Navigation.initialize();
});

window.Navigation = {
  initialize: function(){
    $(document).on("click", ".navigation-controls-back", function(){  Navigation.stepBack() });
    $(document).on("click", ".navigation-controls-forward", function(){  Navigation.stepForward() });
    $(document).on("click", ".menu-purchases", function(){ Purchase.display() });
    $(document).on("click", ".menu-sales", function(){ Sale.display() });
    $(document).on("click", ".menu-cases", function(){ Case.display() });
    $(document).on("click", ".control-panel-user", function(event){ Navigation.toggleUserSettings(event) });
    $(document).on("click", ".window-minimize", function(event) { 
       var window = remote.getCurrentWindow();
       window.minimize();
    });
    $(document).on("click", ".window-maximize", function(event) { 
       var window = remote.getCurrentWindow();
       window.maximize(); 
    });  
    $(document).on("click", ".window-close", function(event) { 
       var window = remote.getCurrentWindow();
       window.close(); 
    });
    $(document).on("click", ".control-panel-discover", function(event){ 
      // Navigation.toggleDiscovery(event) 
      Discover.contracts(false, true);
      $('.chat').show();
      // Navigation.unsetActivePage();
      Navigation.setPageUrl();      
    });
    $(document).on("click", ".menu-home", function(event){
      Discover.contracts(true, false);
      Navigation.setPageUrl();
    });
    $('html').click(function(e) { $('.menu, .user-menu, .chat-conversation-detail-menu').fadeOut(100); });
  },

  getActivePageType: function getActivePageType(){
    var activePage = _.find(pageViews, function(page){ return page.active == true });

    return activePage.page;
  },

  setArrowOpacity: function setArrowOpacity(){
    var page = _.find(pageViews, function(page) { return page.active === true });
    var pageViewSize = pageViews.length - 1;
    var currentPageIndex = _.indexOf(pageViews, page);

    if (currentPageIndex === 0 && currentPageIndex === pageViewSize){
      $('.navigation-controls-back svg, .navigation-controls-forward svg').fadeTo('fast', 0.3);
    }else if(currentPageIndex === 0 && currentPageIndex !== pageViewSize ){
      $('.navigation-controls-back svg').fadeTo('fast', 0.3);
      $('.navigation-controls-forward svg').fadeTo('fast', 1.0);
    }else if(currentPageIndex > 0 && currentPageIndex !== pageViewSize){
      $('.navigation-controls-back svg').fadeTo('fast', 1.0);
      $('.navigation-controls-forward svg').fadeTo('fast', 1.0);     
    }else if(currentPageIndex > 0 && currentPageIndex === pageViewSize){
      $('.navigation-controls-back svg').fadeTo('fast', 1.0);
      $('.navigation-controls-forward svg').fadeTo('fast', 0.3);     
    }
  },

  setAsCurrentPage: function setAsCurrentPage(page){
    page.active = true;
  },

  setPageUrl: function setPageUrl(params){
    var input = $('.input-search');
    if (params){
      input.val(params.trim());
    }else{
      input.val('');
    }
  },

  stepForward: function stepForward(){
    var activePage = _.find(pageViews, function(page){ return page.active == true });
    var pageIndex = _.indexOf(pageViews, activePage);
    if (pageIndex+1 < pageViews.length){
      var nextPage = pageViews[pageIndex+1];
      switch(nextPage.page){
        case "home":
          Discover.contracts(false, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(nextPage);
          Navigation.setPageUrl();
          break;
        case "contract":
          var vendor = Vendor.find(nextPage.guid);
          var contract = _.find(vendor.contracts, function(vendor){ return vendor.id == nextPage.contractid });
          Contract.renderContractDetail(vendor, contract, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(nextPage);
          Navigation.setPageUrl(store.guid + '/' + item.id);
          break;
        case "vendor":
           var vendor = Vendor.find(nextPage.guid);
          Vendor.displayContracts(vendor, false, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(nextPage);
          Navigation.setPageUrl(store.guid);
          break;
        case "user":
          var user = User.find(nextPage.handle);
          Page.view(user, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(nextPage);
          Navigation.setPageUrl(user.handle);
          break;
      }
    } 
    Navigation.setArrowOpacity();
  },

  stepBack: function stepBack(){
    var activePage = _.find(pageViews, function(page){ return page.active == true });
    var pageIndex = _.indexOf(pageViews, activePage);
    if (pageIndex > 0){
      var previousPage = pageViews[pageIndex-1];

      switch(previousPage.page){
        case "home":
          Discover.contracts(false, true);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(previousPage);
          Navigation.setPageUrl();
          break;
        case "contract":
          var vendor = Vendor.find(previousPage.guid);
          var contract = _.find(vendor.contracts, function(vendor){ return vendor.id == previousPage.contractid });
          Contract.renderContractDetail(vendor, contract, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(previousPage);
          Navigation.setPageUrl(store.guid + '/' + store.id);
          break;
        case "vendor":
          var vendor = Vendor.find(previousPage.guid);
          Vendor.displayContracts(vendor, false, true, true);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(previousPage);
          Navigation.setPageUrl(store.guid);
          break;
        case "user":
          var user = User.find(previousPage.handle);
          Page.view(user, false);
          Navigation.unsetActivePage();
          Navigation.setAsCurrentPage(previousPage);
          Navigation.setPageUrl(user.handle);
          break;
      }
    }
      Navigation.setArrowOpacity();
  },

  stripPageHistory: function stripPageHistory(){
    var page = _.find(pageViews, function(item) { return item.active === true });
    var currentPageIndex = _.indexOf(pageViews, page);
    var tmpPageViews = [];

    _.each(pageViews, function(page, index){
      if (index <= currentPageIndex){
        tmpPageViews.push(page);
      }
    });
    pageViews = tmpPageViews;
  },

  toggleDiscovery: function toggleDiscovery(event){
    event.stopPropagation();
    $('.menu').fadeToggle(100);
  },

  toggleUserSettings: function toggleUserSettings(event){
    event.stopPropagation();
    $('.user-menu').fadeToggle(100);
  },

  unsetActivePage: function unsetActivePage(){
    var page = _.find(pageViews, function(page) { return page.active === true })
    if (page){
      page.active = false;
    }
  }
}