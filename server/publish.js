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
        'totalAreas': 1
    }});
});

Meteor.publish("desktopNotifications", function(){
    return DesktopNotifications.find({});
});

Meteor.publish("locations", function(){
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
