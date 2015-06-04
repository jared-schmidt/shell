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
        user.inventory = [];
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

Meteor.methods({
    checkUserName: function(username){
        var user = Meteor.users.findOne({'profile.username': username});

        if (user){
            throw new Meteor.Error(422, 'Username already exists');
        }
        return true;
    }
});
