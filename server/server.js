// Change to use?
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

Meteor.setInterval(function () {
  var now = (new Date()).getTime();

  Meteor.users.find({}).forEach(function(user){

    if ( user.time < now - ((60 * 1000) * user.location.time) ){
        if (!user.location.safe){
            var lowerHealthAmount = 0;
            if (user.totalDefense || user.totalAttack){
                lowerHealthAmount = -1*(((user.location.damage * user.location.difficulty/user.totalDefense + user.totalAttack)*(user.location.damage/user.location.monsters)) + (Math.floor(Math.random()*(user.location.difficulty))) + user.location.difficulty);
            } else {
                lowerHealthAmount = -1*((user.location.damage * user.location.difficulty*(user.location.damage/user.location.monsters)) + (Math.floor(Math.random()*(user.location.difficulty))) + user.location.difficulty);
            }

            lowerHealthAmount = Math.round(lowerHealthAmount);
            if (lowerHealthAmount <= 0){
                lowerHealthAmount = -1 * user.location.monsters;
            }

            var randomnumber = Math.round(Math.floor(Math.random()*(user.location.difficulty + user.location.time + user.location.monsters)) + 1 + user.location.time/2);

            if (user.health >= 0){
                // console.log("Money " + randomnumber);
                // console.log("Lower Health by " + lowerHealthAmount);
                Meteor.users.update({'_id': user._id}, {
                    $inc: {
                        'health': lowerHealthAmount,
                        'money': parseInt(randomnumber)
                    },
                    $set: {'time': now}
                });

                Meteor.call('publishNotification', {
                    title: 'Search',
                    body: "Went on search. Found " + randomnumber + " money. Lost " + lowerHealthAmount + " health.",
                    userid: user._id
                });

            } else {

                Meteor.call('publishNotification', {
                    title: 'Died',
                    body: "You died. You lost "+ randomnumber +" money. You better go back to town!",
                    userid: user._id
                });

                Meteor.users.update({'_id': user._id}, {
                    $inc: {
                        'timesDied': 1,
                        'money': -1*randomnumber,
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

    if (user.location.safe && user.health < 100 && user.healtime < now - ((60 * 1000) * 1)){
        Meteor.users.update({'_id': user._id}, {
            $inc: {'health': 1},
            $set: {
                'healtime': now
            }
        });
    }

  });
}, 500);
