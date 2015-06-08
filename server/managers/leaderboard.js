Meteor.methods({
    'giftMoney': function(amount, fromUser, toUser){

        if (fromUser != toUser){
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

            return Meteor.users.findOne({'_id': toUser}).profile.username;
        }
        throw new Meteor.Error(422, 'Can not gift money to yourself');
    }
});
