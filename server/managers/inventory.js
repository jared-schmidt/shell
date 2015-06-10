Meteor.methods({
    useItem: function(itemid){
        var user = Meteor.user();
        var item = Items.findOne({'_id': itemid});

        // TODO: Should add check to see if itemid is in user inventory
        if(user && item){
            if (item.consumable){
                var inc = {};
                inc[item.action.affects] = item.action.amount;


                // TEMP! Checks if user inventory is array to change to new object
                if( Object.prototype.toString.call( user.inventory ) === '[object Array]' ) {
                    console.log("ARRAY INVENTORY");


                    Meteor.users.update({'_id': user._id}, {
                        $inc: inc,
                        $pull: {'inventory': itemid}
                    });

                } else{

                    if (user.inventory[itemid] > 0){
                        var set = {'inventory': user.inventory};
                        var num = -1;
                        set.inventory[itemid] = user.inventory[itemid] + parseInt(num);

                        if(item.type == 'food' && user.hunger + item.action.amount >= 0){
                            Meteor.users.update({'_id': user._id}, {
                                $inc: inc,
                                $set: set
                            });
                        } else if (item.type == 'food' && user.hunger + item.action.amount < 0){
                            throw new Meteor.Error(422, 'You are not that hungry.');
                        } else {
                            Meteor.users.update({'_id': user._id}, {
                                $inc: inc,
                                $set: set
                            });
                        }
                    }
                }
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
               if (obj === itemid){
                    currentLocation = key;
                    break;
               }
            }
        }



        if ( currentLocation == 'rightHand'){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.rightHand': null
                }
            });
        } else if ( currentLocation == 'leftHand'){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.leftHand': null
                }
            });
        } else if (currentLocation == 'head'){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.head': null
                }
            });
        } else if (currentLocation === 'body'){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.body': null
                }
            });
        } else if (currentLocation == 'feet'){
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'equipment.feet': null
                }
            });
        }


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


        // FIX FOR negative values
        var wearingSomething = false;
        for (var key in user.equipment) {
           if (user.equipment.hasOwnProperty(key)) {
               var obj = user.equipment[key];
               if (obj){
                    wearingSomething = true;
               }
            }
        }

        if(!wearingSomething){
            console.log("set to 0");
            Meteor.users.update({'_id': user._id}, {
                $set: {
                    'totalDefense': 0,
                    'totalAttack': 0
                }
            });
        }
        // ////////////////////

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
});
