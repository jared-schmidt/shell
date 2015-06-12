Meteor.methods({
    buyItem: function(itemid){
        var user = Meteor.user();

        // Checks that the a real itemid was sent to the server, and gets the cost
        var newItem = Items.findOne({'_id': itemid});

        if (newItem && user){
            if (user.money-newItem.cost >= 0){

                var newInv = {inventory: {}};
                // TEMP! Checks if user inventory is array to change to new object
                if( Object.prototype.toString.call( user.inventory ) === '[object Array]' ) {
                    console.log("ARRAY INVENTORY");
                    _.each(user.inventory, function(item){
                        newInv.inventory[item] = 1;
                    });

                    if (newInv){
                        Meteor.users.update({'_id': user._id}, {
                            $set: newInv
                        });
                    }
                }

                var set = {
                    'inventory': user.inventory,
                    'money': user.money - newItem.cost
                };

                if (user.inventory.hasOwnProperty(itemid)){
                    set.inventory[itemid] = user.inventory[itemid] + 1;
                } else {
                    set.inventory[itemid] = 1;
                }


                Meteor.users.update({'_id': user._id}, {
                    $set: set
                });

                return newItem.name;
            } else {
                throw new Meteor.Error(422, 'Not enough money');
            }
        } else {
            throw new Meteor.Error(422, 'Bad item id or user');
        }
    }
})
