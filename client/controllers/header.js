Meteor.subscribe('userData');

Template.user_loggedin.events({
    "click #logout": function(event, tmpl) {
        Meteor.logout(function(err) {
            if (err) {
                alert('error : ' + err);
                throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
            } else {
                //show alert that says logged out
                //alert('logged out');
            }
        });
    }
});


function getLayoutColor(){
    console.log("get color");
    return "blue-grey";
}

Template.topNav.helpers({
    'layoutColor': getLayoutColor
});

Template.sideNav.helpers({
    'layoutColor': getLayoutColor
});

Template.loginLayout.helpers({
    'layoutColor': getLayoutColor
});


Template.topNav.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
});

Template.sideNav.events({
    'click a':function(e){
        $("#wrapper").removeClass("toggled");
    }
});

Template.infoBar.helpers({
    'getLocation': function(){
        var user = Meteor.user();
        var location = "Loading...";
        if (user && user.location){
            location = user.location.name;
        }
        return location;
    },
    'getMoney': function(){
        var user = Meteor.user();
        var money = "Loading...";
        if (user){
            money = user.money;
        }
        return money;
    },
    'getHealth': function(){
        var user = Meteor.user();
        var health = "Loading...";
        if (user){
            health = user.health;
        }
        return health;
    }
});
