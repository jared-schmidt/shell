Meteor.startup(function (){
  $.material.init();
});

Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'username',
        fieldLabel: 'Username',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          var isBad = true;

          if (!value) {
                errorFunction("Need a username");
          } else {
            Meteor.call('checkUserName', value, function(err){
                if (err){
                    console.error("err");
                    errorFunction("Username in use");
                } else {
                    isBad = false;
                }
            });
          }

          return isBad;
        }
    }]
});


Deps.autorun(function() {
    Meteor.subscribe('messages');
    if(Meteor.Device.isDesktop()){
        Notification.requestPermission();
        Meteor.subscribe('desktopNotifications');
        Meteor.autosubscribe(function() {
            DesktopNotifications.find({}).observe({
                added: function(notification) {
                  if (Meteor.user()){
                    if (notification.userid == Meteor.user()._id){
                        new Notification(notification.title, {
                            dir: 'auto',
                            lang: 'en-US',
                            body: notification.body,
                            icon: '/icons/scallop.png'
                        });
                        Meteor.call('showedNotification', notification._id);
                    }
                  }
                }
            });
        });
    }
});

toastr.options = {
  "closeButton": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "timeOut": "2000"
};

Template.layout.events({
    'click .closeMessage': function(){
        Meteor.call('userClosed', this._id, function(err){
            if (err){
                toastr.error(err.reason, "Error!");
            }
        });
    }
});

Template.layout.helpers({
    messages : function(){
        var user = Meteor.user();
        if (user){
          return Messages.find({'usersClosed' : {"$nin" : [user._id]}});
        }
        return Messages.find({});
    }
});
