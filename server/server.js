// NOT IN USE!

// Change to use?
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function lowerHealth(user){
    var lowerHealthAmount = 0;

    var defense = 1;
    if (user.totalDefense){
        defense = user.totalDefense;
    }

    var attack = 1;
    if (user.totalAttack){
        attack = user.totalAttack;
    }

    var monsterDamage = ((user.location.damage/(defense/user.location.difficulty))*user.location.difficulty) * (user.location.monsters/(attack/user.location.difficulty));
    var randomNumber = Math.floor(Math.random()*(user.location.difficulty)) + user.location.difficulty;

    lowerHealthAmount = Math.round(monsterDamage + (user.location.monsters/2) + randomNumber);

    if (lowerHealthAmount <= 0){
        lowerHealthAmount = user.location.monsters*user.location.damage;
    }

    return -1*(lowerHealthAmount);
}

function findMoney(user){
    var randomnumber = Math.floor(Math.random()*((user.location.difficulty * user.location.time) + user.location.monsters)) + (user.location.time*user.location.difficulty)/2;
    return Math.round(randomnumber);
}


Meteor.methods({
    'stats': function(){

        var locations = Locations.find({}).fetch();

        var returnList = [];

        _.each(locations, function(location){
            var returnObj = {};

            // def = 49
            // att = 37

            var user = {
                'totalDefense': 0,
                'totalAttack': 0,
                'location': location
            };

            var lowerHealthAmount = lowerHealth(user);
            var findMoneyAmount = findMoney(user);
            returnObj.lowerHealthAmount = lowerHealthAmount;
            returnObj.findMoneyAmount = findMoneyAmount;
            returnObj.location = location;
            returnObj.def = user.totalDefense;
            returnObj.att = user.totalAttack;
            returnList.push(returnObj);
        });

        return returnList;
    }
});


Meteor.methods({
    "goOnSearch": function(user){
        var now = (new Date()).getTime();
        if ( user.time < now - ((60 * 1000) * user.location.time) ){
            if (!user.location.safe){
                var lowerHealthAmount = lowerHealth(user);
                var findMoneyAmount = findMoney(user);
                var foundArea = false;

                // This is adding becuase lowerhealthamount is negitive
                if (user.health + lowerHealthAmount >= 0){
                    // console.log("Money " + randomnumber);
                    // console.log("Lower Health by " + lowerHealthAmount);


                    // TODO: THIS IS HERE FOR EXISTING USER! REMOVE AFTER BETA?
                    if(!user.hasOwnProperty('areas')){
                        Meteor.users.update({'_id': user._id}, {
                            $set: {
                                'areas': {},
                                'totalAreas': 0
                            }
                        },{upsert: true});
                    }
                    ///////////////////////////////////////////////////////////

                    var set = {'areas': user.areas};
                    set.time = now;

                    var findArea = Math.random()*100;
                    if (user.areas.hasOwnProperty(user.location._id)){
                        if (findArea < 2*user.location.time){
                            foundArea = true;
                            set.areas[user.location._id] = user.areas[user.location._id] + 1;
                            set.totalAreas = user.totalAreas + 1;
                        }
                    } else {
                        if (findArea < 2*user.location.time){
                            foundArea = true;
                            set.areas[user.location._id] = 0;
                            set.totalAreas = user.totalAreas + 1;
                        }
                    }

                    Meteor.users.update({'_id': user._id}, {
                        $set: set
                    },{upsert: true});

                    Meteor.users.update({'_id': user._id}, {
                        $inc: {
                            'health': lowerHealthAmount,
                            'money': findMoneyAmount,
                            'totalSearch': 1
                        },
                        $set: set
                    },{upsert: true});

                    var noteMsg = '';
                    if(foundArea){
                        noteMsg = "Went on search. Found " + findMoneyAmount + " money, and an area of the location. Lost " + -1*lowerHealthAmount + " health.";
                    } else {
                        noteMsg = "Went on search. Found " + findMoneyAmount + " money. Lost " + -1*lowerHealthAmount + " health.";
                    }

                    Meteor.call('publishNotification', {
                        title: 'Search',
                        body: noteMsg,
                        userid: user._id
                    });

                    var stats = {
                        'totalDefense': user.totalDefense,
                        'totalAttack': user.totalAttack,
                        'HealthLost' : lowerHealthAmount,
                        'moneyFound': findMoneyAmount,
                        'foundArea': foundArea
                    };

                    Locations.update({'_id': user.location._id}, {$push: {
                        'stats': stats
                    }},{upsert: true});

                } else {

                    Meteor.call('publishNotification', {
                        title: 'Died',
                        body: "You died. You lost "+ findMoneyAmount +" money. You better go back to town!",
                        userid: user._id
                    });

                    Meteor.users.update({'_id': user._id}, {
                        $inc: {
                            'timesDied': 1,
                            'money': (-1*findMoneyAmount)
                        },
                        $set: {
                            'time': now,
                            'health': 0,
                            'healtime': now
                            // 'location': Locations.findOne({'start': true})
                        }
                    });
                }
            }
        }
    },
    'healInTown': function(user){
        var now = (new Date()).getTime();

        // Every Minute
        if ( user.healtime < now - ((60 * 1000) * 1) ){
            if (user.location.safe && user.health < 100){
               Meteor.users.update({'_id': user._id}, {
                   $inc: {'health': 3},
                   $set: {
                       'healtime': now
                   }
               });
           }
        }

        // 5 minutes
        // if ( user.healtime < now - ((60 * 1000) * 5) ){
        //     if (user.location.safe && user.health >= 100){
        //         Meteor.users.update({'_id': user._id}, {
        //             $set: {
        //                 'healtime': now
        //             }
        //         });

        //         Meteor.call('publishNotification', {
        //             title: 'Healed',
        //             body: "You are fully healed!",
        //             userid: user._id
        //         });
        //    }
        // }
    }
});
