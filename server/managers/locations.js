Meteor.methods({
    changeLocation: function(locationid){
        var user = Meteor.user();
        if (user.location._id === locationid){
            throw new Meteor.Error(422, 'Already in ' + user.location.name);
        }

        var newLocation = Locations.findOne({'_id': locationid});

        Meteor.users.update({'_id': user._id}, {
            $set: {
                'location': newLocation,
                'time': (new Date()).getTime()
            }
        });

        Locations.update({'_id': user.location._id}, {
            $inc: {
                'totalTravel': 1
            }
        },{upsert: true});

        return newLocation.name;
    }
});
