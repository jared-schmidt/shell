Meteor.methods({
    publishNotification: function(notification){
        // DesktopNotifications.remove({});
        DesktopNotifications.insert(notification);
        // setTimeout(Meteor.bindEnvironment(function() {
            // DesktopNotifications.remove({}); //remove all again so we don't get pop ups when first loading
        // }));
    },
    showedNotification: function(notificationid){
        DesktopNotifications.remove({'_id': notificationid});
    }
});
