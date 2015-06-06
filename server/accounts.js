Accounts.onCreateUser(function(options, user){

    if(!options || !user){
        throw new Meteor.Error(111, "No user created");
    } else {
        if(options.profile){
            user.profile = options.profile;
        }

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
        user.time = (new Date()).getTime();
        user.healtime = (new Date()).getTime();
        user.createdOn = new Date();
        user.areas = {};
        user.totalAreas = 0;
    }

    return user;
});

Accounts.onLogin(function(user){
    user = user.user;

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
