$(function() {
  window.Chat.initialize();
});

window.Chat = {
  initialize: function() {
    this.chats = JSON.parse(JSON.stringify(preloadData.chats));
    $(document).on('click', '.chat-icon-down, .chat-conversation-detail-title', function(event){ 
      event.stopPropagation();
      Chat.conversationMenu(event) });
    $(document).on('click', '.chat-conversation-detail-close', function(event){ Chat.closeConversation(event) });
    $(document).on('click', '.chat-close', function(event){ Chat.closePanel(event) });
    $(document).on('click', '.chat-start-new-conversation', function(event){ Chat.startNewConversation(event) });
    $(document).on('click', '.chat-block-user', function(event){ Chat.block($(event.currentTarget).attr('data-user-id')) });
    $(document).on('click', '.chat-conversation-detail-delete', function(event){ Chat.deleteThread($(event.currentTarget).attr('data-chat-id')) });
    $(document).on('click', '.chat-search, .chat-new', function(event){ Chat.openPanel(event) });
    $(document).on('click', '.chat-condensed, .chat-condensed-title, .chat-close, .chat-header', function(){ Chat.toggle(event) });
    $(document).on('click', '.chat-message', function(event){
      Chat.viewDetails($(event.currentTarget).attr('data-id'));
    });
    $(document).on("click", ".chat-avatar", function(event){
      Chat.viewDetails($(event.currentTarget).attr('data-id'));
    });
    $(document).on("click", ".vendor-message", function(event){
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Chat.startNewConversation(Vendor.find(vendorGuid));
    });
    $(document).on("click", ".user-page-message", function(event){
      event.stopPropagation();
      var handle = $(event.currentTarget).attr('data-user-handle');
      $('.chat-list-input-new').val(handle);
      Chat.startNewConversation(User.find(handle));
      $('.input-chat-new-message').focus();
    });
    $(document).on("click", ".modal-purchase-dispute", function(event){
      event.stopPropagation();
      var modGuid = $(event.currentTarget).attr('data-mod-guid');
      var mod = _.find(mods, function(mod){ return mod.guid == modGuid });
      Chat.startNewConversation(mod);
      $('.input-chat-new-message').attr("placeholder","What are you disputing?");
    });
  },

  find: function find(id) {
    return _.find(this.chats, function(chat){ return chat.id == id })
  },

  block: function block(id){
    if (confirm("Are you sure you want to block this user?") == true) {
      new Notification('User blocked');  
    }
  },

  startNewConversation: function startNewConversation() {
    Chat.openPanel();
    $('.chat-conversation-detail').hide();
    $('.chat-new-conversation').show();
    $('.chat-list-input-new').focus();
  },

  closePanel: function close(){
    $('.user-page, .transactions, .settings, .discover, .notifications').css('left', 0);
    $('.chat table tr').css('border-bottom-width', 0);
    $('.chat').css('right', '-181px');
    $('.chat-conversation-detail, .chat-new-conversation').hide();
    $('.chat-view-details').removeClass('chat-active');
  },

  loadMessages: function loadMessages(){
    $('.chat-conversations table').empty();

    _.each(window.preloadData.chats.reverse(), function(chat){
      var conversation = chat.conversation;
      var lastMessage = _.last(conversation);
      if(chat.read){
        var read = 'chat-read';
      }else{
        var read = ''
      }

      if(lastMessage){
        $('.chat-conversations table').append('<tr class="chat-view-details ' + read + '" data-id="' + chat.id + '"><td style="width: 30px"><div class="chat-avatar" data-id="' + chat.id + '" style="background: url(' + lastMessage.avatar + ') 100% 100% / cover no-repeat"></div></td><td class="chat-message" data-id="' + chat.id + '"><div class="chat-name" data-id="' + chat.id + '">' + lastMessage.from +  '</div><div data-id="' + chat.id + '">' + lastMessage.message + '</div></td></tr>');
      }
    });
  },

  deleteThread: function deleteThread(id){
    if (confirm("Are you sure you want to delete this conversation?") == true) {
      window.preloadData.chats = _.without(window.preloadData.chats, _.findWhere(window.preloadData.chats, {id: parseInt(id)}));
      $('.chat-conversation-detail').hide();
      $('.chat-view-details[data-id=' + id + ']').remove();
    }
  },

  closeConversation: function closeConversation(){
    $('.chat-conversation-detail ').hide();
    $('.chat-view-details').removeClass('chat-active');
  },

  openPanel: function openPanel(){
    $('.user-page, .transactions, .settings, .discover, .notifications').css('left', '-110px');
    $('.chat table tr').css('border-bottom-width', '1px');
    $('.chat').css('right', 0);
    $('.chat-conversation-detail ').show();
  },

  newConversation: function newConversation(vendor){
    var chat = {
      "id": vendor.id,
      "read": true,
      "incoming": false,
      "from": "@wolf",
      "to": Vendor.handle(vendor),
      "date": "",
      "conversation": []
    };
    window.preloadData.chats.push(chat);
    Chat.saveMessage();
  },

  conversationMenu: function conversationMenu(){
    if ($('.chat-conversation-detail-menu').is(':visible')){
      $('.chat-conversation-detail-menu').hide();
    }else{
      $('.chat-conversation-detail-menu').show();
    }
  },

  saveMessage: function saveMessage(){
    var id = $('.input-chat-new-message').attr('data-id');
    var chat = Chat.find(id);
    var newMessage = {
      "from": "@wolf",
      "message": $('.input-chat-new-message').val(),
      "avatar": "https://pbs.twimg.com/profile_images/451017489065857024/vdpDUxoZ_400x400.jpeg"
    }
    chat.conversation.push(newMessage);
    $('.input-chat-new-message').val('');
    $('.chat-conversation-detail-body').scrollTop($('.chat-conversation-detail-body')[0].scrollHeight);
    Chat.viewDetails(id);
  },

  startNewChat: function startNewChat(message){
    Chat.loadMessages();
    if ($('.chat').css('bottom') === "-310px"){
      $('.chat-count').hide();
      $('.chat-close').show();
      $('.chat').css('bottom','0px');
    }

    $('.chat-conversations ul').prepend('<li class="chat-view-details"><div class="chat-holder"><div class="chat-avatar" style="background: url(' + message.avatar + ') 100% 100% / cover no-repeat"></div><div class="chat-message"><div class="chat-name">' + message.handle +  '</div><div></div></div></div></li>');
    $('.chat-conversations').scrollTop(0);
    $('.chat-conversations').css('overflow','hidden');
    $('.chat-conversation-detail-body').empty();
    $('.chat-avatar').not('.chat-avatar:first').fadeTo(150, 0.15);
    $('.input-chat-new-message').focus();
  },

  viewDetails: function viewDetails(id){
    var chat = Chat.find(id);
    Chat.openPanel();
    $('.chat-view-details').removeClass('chat-active');
    $('.chat-view-details[data-id=' + id + ']').addClass('chat-read').addClass('chat-active');
    $('.chat-conversations').css('overflow','hidden');
    $('.chat-conversation-detail-menu, .chat-conversation-detail-delete').attr('data-chat-id', id);
    $('.chat-conversation-detail').show().css('right', '0');
    $('.input-chat-new-message').val('').attr('data-id', id).focus();
    $('.chat-new-conversation').hide();
    $('.chat-conversation-detail .chat-conversation-detail-body').empty();
    $('.chat-conversation-detail-title span').html(chat.from);

    _.each(chat.conversation, function(message){
      if (message.from === "@wolf"){
        var bodyClass = 'chat-conversation-detail-flip';
      }else{
        var bodyClass = '';
      }
      $('.chat-conversation-detail .chat-conversation-detail-body').append('<div class="' + bodyClass + ' position-clear-both "><div class="chat-conversation-detail-avatar user-page-link" data-user-handle="' + message.from + '" style="background: url(' + message.avatar +') 100% 100% / cover no-repeat"></div><div class="chat-conversation-detail-message">' + message.message + '</div></div>');
    });
  }
}
