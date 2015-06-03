Meteor.methods({
    useItem: function(itemid){
        var user = Meteor.user();
        var item = Items.findOne({'_id': itemid});

        // TODO: Should add check to see if itemid is in user inventory
        if(user && item){
            if (item.consumable){
                var inc = {};
                inc[item.action.affects] = item.action.amount;
                Meteor.users.update({'_id': user._id}, {
                    $inc: inc,
                    $pull: {'inventory': itemid}
                });
            }
        }
    },
    removeItem: function(itemid){
        var user = Meteor.user();

        var currentLocation = '';

        var item = Items.findOne({'_id': itemid});

        for (var key in user.equipment) {
           if (user.equipment.hasOwnProperty(key)) {
               var obj = user.equipment[key];
               console.log(key + ' = ' + obj);
               if (obj === itemid){
                    console.log("Match");
                    currentLocation = key;
                    break;
               }
            }
        }

        // var set = {'equipment': {}};
        var set = user;
        set.equipment[currentLocation] = null;
        Meteor.users.update({'_id': user._id}, {
            $set: set
        });

        // Would not let me do both the set and inc in one call.
        // brought back error
        // Exception while invoking method 'removeItem' MongoError:
        // Cannot update 'totalDefense' and 'totalDefense' at the same time
        Meteor.users.update({'_id': user._id}, {
            $inc: {
                'totalDefense': -1*item.defense,
                'totalAttack': -1*item.damage
            }
        });



    },
    wearItem: function(itemid){
        var user = Meteor.user();
        var item = Items.findOne({'_id': itemid});

        // TODO: Should add check to see if itemid is in user inventory

        if (item.location === 'hand'){
            if (!user.equipment.rightHand){
                Meteor.users.update({'_id': user._id}, {
                    $set: {
                        'equipment.rightHand': item._id
                    },
                    $inc: {
                        'totalDefense': item.defense,
                        'totalAttack': item.damage
                    }
                });
            } else if (!user.equipment.leftHand){
                Meteor.users.update({'_id': user._id}, {
                    $set: {
                        'equipment.leftHand': item._id
                    },
                    $inc: {
                        'totalDefense': item.defense,
                        'totalAttack': item.damage
                    }
                });
            }
        } else if (item.location === 'head' && !user.equipment.head){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.head': item._id
                },
                $inc: {
                    'totalDefense': item.defense,
                    'totalAttack': item.damage
                }
            });
        } else if (item.location === 'body' && !user.equipment.body){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.body': item._id
                },
                $inc: {
                    'totalDefense': item.defense,
                    'totalAttack': item.damage
                }
            });
        } else if (item.location === 'feet' && !user.equipment.feet){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.feet': item._id
                },
                $inc: {
                    'totalDefense': item.defense,
                    'totalAttack': item.damage
                }
            });
        } else {
            throw new Meteor.Error(422, 'Already have something in use');
        }
    }
})
