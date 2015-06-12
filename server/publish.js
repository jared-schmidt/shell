Meteor.publish("userData", function(){
    return Meteor.users.find({}, {fields: {
        'location': 1,
        'money': 1,
        'health': 1,
        'inventory': 1,
        'equipment': 1,
        'totalDefense': 1,
        'totalAttack': 1,
        'time': 1,
        'totalAreas': 1,
        'hunger': 1,
        'traveling': 1,
        'status.online': 1
    }});
});

Meteor.publish("desktopNotifications", function(){
    return DesktopNotifications.find({});
});

Meteor.publish("locations", function(){
    // var locations = Locations.find({}).fetch();
    //
    // var user = Meteor.users.findOne({'_id': this.userId});
    //
    // var return_location = [];
    //
    // // TODO: Turn into function?
    //
    // _.each(locations, function(location, locationIndex){
    //
    //     if (location.key){
    //         for (var key in user.inventory) {
    //            if (user.inventory.hasOwnProperty(key)) {
    //                var obj = user.inventory[key];
    //                itemInfo = Items.find({'_id': key}).fetch()[0];
    //                 if(itemInfo){
    //                     if(itemInfo.action && itemInfo.action.affects === 'location'){
    //                         if (itemInfo.action && itemInfo.action.amount.toLowerCase() == location.name.toLowerCase()){
    //                             return_location.push(location._id);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //
    //     } else {
    //         return_location.push(location._id);
    //     }
    // });

    // return Locations.find({'_id': {$in: return_location}});
    return Locations.find({});
});

Meteor.publish("items", function(){
    return Items.find({});
});

Meteor.publish("leader", function(){
    return Meteor.users.find({}, {fields: {
        'profile': 1,
        'money': 1,
        'timesDied': 1
    }});
});

Meteor.publish('messages', function(){
    return Messages.find({});
});
