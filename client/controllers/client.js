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
                            icon: 'shell.png'
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
