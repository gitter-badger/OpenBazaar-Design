$(function() {
  window.Chat.initialize();
});

window.Chat = {
  initialize: function() {
    this.chats = JSON.parse(JSON.stringify(preloadData.chats));
    $(document).on('click', '.chat-condensed, .chat-condensed-title, .chat-close, .chat-header', function(){ Chat.toggle(event) });
    $(document).on('click', '.chat-view-all', function(){ Chat.viewAll() });
    $(document).on('click', '.chat-message', function(event){
      var id = $(event.currentTarget).parent().parent().data('id');
      Chat.viewDetails(id);
    });
    $(document).on("click", ".chat-avatar", function(event){
      Chat.openPanel();
    });
    $(document).on("click", ".vendor-message", function(event){
      event.stopPropagation();
      var vendorGuid = $(event.currentTarget).attr('data-vendor-guid');
      Chat.startNewChat(Vendor.find(vendorGuid));
    });
    $(document).on("click", ".user-profile-message", function(event){
      event.stopPropagation();
      var handle = $(event.currentTarget).attr('data-user-handle');
      Chat.startNewChat(User.find(handle));
    });
    $(document).on("click", ".modal-purchase-dispute", function(event){
      event.stopPropagation();
      var modGuid = $(event.currentTarget).attr('data-mod-guid');
      var mod = _.find(mods, function(mod){ return mod.guid == modGuid });
      Chat.startNewChat(mod);
      $('.input-chat-new-message').attr("placeholder","What are you disputing?");
    });
  },

  find: function find(id) {
    return _.find(this.chats, function(chat){ return chat.id == id })
  },

  loadMessages: function loadMessages(){
    $('.chat-expanded-conversations ul').empty();
    $('.chat-expanded').css('overflow-y','scroll');

    _.each(this.chats.reverse(), function(chat){
      var conversation = chat.conversation;
      var lastMessage = _.last(conversation);
      if(chat.read){
        var read = 'chat-read';
      }else{
        var read = ''
      }

      if(lastMessage){
        $('.chat-conversations table').append('<tr class="chat-view-details ' + read + '" data-id="' + chat.id + '"><td><div class="chat-avatar" style="background: url(' + lastMessage.avatar + ') 100% 100% / cover no-repeat"></div></td><td class="chat-message visibility-hidden"><div class="chat-name">' + lastMessage.from +  '</div><div>' + lastMessage.message + '</div></td></tr>');
      }
    });
  },

  openPanel: function openPanel(vendor){
      $('.user-page').css('left', '-100px');
      $('.chat').css('right', '-10px');
      $('.chat-message').show();
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
    this.chats.push(chat);
    Chat.saveMessage();
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
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-conversation-detail-body').empty();
    $('.chat-title').html('<div class="chat-view-all chat-back button-chat-control position-float-left"><</div><div class="chat-view-all position-float-left">Messages</div>');
    $('.chat-conversation-detail-title').html(message.handle).attr('data-user-handle', message.handle);
    $('.chat-avatar').not('.chat-avatar:first').fadeTo(150, 0.15);
    $('.input-chat-new-message').focus();
  },

  viewAll: function viewAll(){
    $('.chat-message').show();
    $('.chat-conversation-detail').hide();
    $('.chat-avatar').fadeTo(0, 1);
    $('.chat-conversations').css('overflow-y','scroll');
    $('.chat-title').html('Messages');
  },

  viewDetails: function viewDetails(id){
    var chat = Chat.find(id);
    $('.chat-view-details[data-id=' + id + ']').addClass('chat-read');
    $('.chat-conversations').css('overflow','hidden');
    $('.input-chat-new-message').val('');
    $('.chat-message').hide();
    $('.chat-conversation-detail').show();
    $('.chat-view-details').not( '[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 0.15);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-avatar').fadeTo(150, 1);
    $('.chat-view-details[data-id=' + id + ']').find('.chat-message-count').remove();
    $('.input-chat-new-message').focus();
    $('.input-chat-new-message').attr('data-id', id);
    $('.chat-conversation-detail-title').html(chat.from).attr('data-user-handle', chat.from);
    $('.chat-title').html('<div class="chat-view-all chat-back button-chat-control position-float-left"><</div><div class="chat-view-all position-float-left">Messages</div>');
    $('.chat-count').html($('.chat-message-count').length);
    if ($('.chat-count').length === 0){
      $('.chat-count').hide();
    }

    $('.chat-conversation-detail .chat-conversation-detail-body').empty();
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
