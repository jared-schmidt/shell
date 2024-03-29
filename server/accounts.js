Accounts.onCreateUser(function(options, user){

    if(!options || !user){
        throw new Meteor.Error(111, "No user created");
    } else {
        if(options.profile){
            user.profile = options.profile;
        }

        var now = (new Date()).getTime();

        user.money = 0;
        user.equipment = {
            'head': null,
            'body': null,
            'feet': null,
            'leftHand': null,
            'rightHand': null
        };
        user.inventory = {};
        user.location = Locations.findOne({'start':true});
        user.health = 100;
        user.totalDefense = 0;
        user.totalAttack = 0;
        user.timesDied = 0;
        user.time = now;
        user.healtime = now;
        user.eatTime = now;
        user.createdOn = new Date();
        user.areas = {};
        user.totalAreas = 0;
        user.giftedMoney = 0;
        user.receivedMoney = 0;
        user.hunger = 0;
        user.exp = 0;
    }

    return user;
});

Accounts.onLogin(function(user){
    user = user.user;

    if (user.hasOwnProperty('profile')){
        console.log("Log in " + user.profile.username);
    }

    // TEMP! Checks if user inventory is array to change to new object
    var newInv = {inventory: {}};
    if( Object.prototype.toString.call( user.inventory ) === '[object Array]' ) {
        console.log("ARRAY INVENTORY");
        _.each(user.inventory, function(item){
            newInv.inventory[item] = 1;
        });

        if (!_.isEmpty(newInv)){
            console.log("Set new inv");
            Meteor.users.update({'_id': user._id}, {
                $set: newInv
            });
        }
    }

    // TEMP
    if (!user.hasOwnProperty('hunger')){
        console.log("Adding hunger to user");
        Meteor.users.update({'_id': user._id}, {
            $set: {
                'hunger': 0,
                'eatTime':(new Date()).getTime()
            }
        });
    }

    // TEMP
    if (!user.hasOwnProperty('eatTime')){
        console.log("Adding eatTime to user");
        Meteor.users.update({'_id': user._id}, {
            $set: {
                'eatTime':(new Date()).getTime()
            }
        });
    }

    // TEMP
    if (!user.hasOwnProperty('teleport')){
        console.log("Adding teleport to user");
        Meteor.users.update({'_id': user._id}, {
            $set: {
                'teleport': 0
            }
        });
    }

});

Meteor.methods({
    checkUserName: function(username){
        var user = Meteor.users.findOne({'profile.username': username});

        if (user){
            throw new Meteor.Error(422, 'Username already exists');
        }
        return true;
    }
});
