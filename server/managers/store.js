Meteor.methods({
    buyItem: function(itemid){
        var user = Meteor.user();

        // Checks that the a real itemid was sent to the server, and gets the cost
        var newItem = Items.findOne({'_id': itemid});

        if (newItem && user){
            if (user.money-newItem.cost >= 0){
                Meteor.users.update({'_id': user._id}, {
                    // $push: { // Changed to be a set. User can not have more then 1 of an item
                    $addToSet:{
                        'inventory': itemid
                    },
                    $inc: {
                        'money': -1*(newItem.cost)
                    }
                });
            } else {
                throw new Meteor.Error(422, 'Not enough money');
            }
        } else {
            throw new Meteor.Error(422, 'Bad item id or user');
        }
    }
})
