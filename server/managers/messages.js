Meteor.methods({
    addMessage: function(message){
        var user = Meteor.user();

        if (user.profile.username != 'jschmidt'){
            throw new Meteor.Error(422, 'Must be Jared');
        }

        if (!message){
            throw new Meteor.Error(422, 'No Message text found');
        }

        var messageId = Messages.insert({
            'message': message,
            'usersClosed': [],
            'display': true,
            'addedBy': user._id,
            'createdOn': new Date()
        });
        return messageId;

    },
    deleteMessage: function(messageId){
        var user = Meteor.user();

        if (user.profile.username != 'jschmidt'){
            throw new Meteor.Error(422, 'Must be an admin to add');
        }

        if (!messageId){
            throw new Meteor.Error(422, 'No Message id found');
        }

        Messages.remove(messageId);
    },
    userClosed: function(messageId){
        var user = Meteor.user();

        Messages.update(messageId, {
            $addToSet: {'usersClosed': user._id}
        });
    }
});
