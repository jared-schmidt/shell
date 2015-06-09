Meteor.methods({
    'giftMoney': function(amount, fromUser, toUser){
        var from = Meteor.users.findOne({'_id': fromUser});

        if (fromUser != toUser){
            if (amount > 0){
                if (from.money > 0 && from.money > amount){
                    var negAmount = -1*amount;
                    if (amount > 0){
                        negAmount = -1*amount;
                    }

                    if (amount < 0){
                        amount = -1*amount;
                    }

                    Meteor.users.update({'_id': fromUser }, {$inc:{
                        'money': parseInt(negAmount),
                        'giftedMoney': 1
                    }}, {upsert: true});

                    Meteor.users.update({'_id': toUser }, {$inc:{
                        'money': parseInt(amount),
                        'receivedMoney': 1
                    }}, {upsert: true});

                    var noteMsg = from.profile.username + " gifted you " + amount;
                    Meteor.call('publishNotification', {
                        title: 'Gift',
                        body: noteMsg,
                        userid: toUser
                    });

                    return Meteor.users.findOne({'_id': toUser}).profile.username;
                } else {
                    throw new Meteor.Error(422, 'You do not have that much money');
                }
            } else {
                throw new Meteor.Error(422, 'You can not gift a negative amount.');
            }
        }
        throw new Meteor.Error(422, 'Can not gift money to yourself');
    }
});
