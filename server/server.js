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

    var locationInfo = Locations.findOne({'_id': user.location._id});

    if (locationInfo.hasOwnProperty('specialMaterial') && locationInfo.specialMaterial){
      for (var key in user.equipment) {
         if (user.equipment.hasOwnProperty(key)) {
             var obj = user.equipment[key];
             var itemInfo = Items.findOne({'_id': obj});
             if (itemInfo){
               if (itemInfo.material.toLowerCase() == locationInfo.specialMaterial.toLowerCase()){
                 defense = defense + (itemInfo.defense*6);
                 attack = attack + (itemInfo.damage*7);
               } else {
                 defense = defense - (itemInfo.defense*6*locationInfo.difficulty);
                 attack = attack - (itemInfo.damage*7*locationInfo.difficulty);
               }
             } else {

               if (key == 'head' || key == 'body' || key == 'feet'){
                 defense = defense - (locationInfo.difficulty * locationInfo.monsters * locationInfo.damage);
               } else {
                 attack = attack - (locationInfo.difficulty * locationInfo.monsters);
               }
             }
          }
      }
    }

    var monsterDefense = 0;
    var monsterAttack = 0;

    if (defense > 0){
        monsterDefense = (user.location.damage/(defense/user.location.difficulty)*user.location.difficulty);
    } else {
        monsterDefense = (user.location.damage*(defense*user.location.difficulty)*user.location.difficulty);
    }

    if (attack > 0){
        monsterAttack = user.location.monsters/(attack/user.location.difficulty);
    } else {
        monsterAttack = user.location.monsters*(attack*user.location.difficulty);
    }


    var monsterDamage = Math.round(( monsterDefense * monsterAttack ));
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


function findPage(user){
  var set = {'pages': user.pages};
  var foundPage = false;

  var findPageChance = Math.random()*100;

  if (findPageChance < 2*user.location.time){
    if (user.pages.hasOwnProperty(user.location._id && user.pages[user.location._id] < 1)){
      foundPage = true;
      set.pages[user.location._id] = user.pages[user.location._id] + 1;
      set.totalPages = user.totalPages + 1;
    } else {
      foundPage = true;
      set.pages[user.location._id] = 1;
      set.totalPages = user.totalPages + 1;
    }
  }

  if(foundPage){

    Meteor.users.update({'_id': user._id}, {
        $set: set
    },{upsert: true});
  }

  return foundPage;
}


function findArea(user){

  ///////////////////////////////////////////////////////////
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

  var foundArea = false;

  var set = {'areas': user.areas};

  var findAreaChance = Math.random()*100;

  if (findAreaChance < 2*user.location.time){
    if (user.areas.hasOwnProperty(user.location._id)){
        foundArea = true;
        set.areas[user.location._id] = user.areas[user.location._id] + 1;
        set.totalAreas = user.totalAreas + 1;
    } else {
      foundArea = true;
      set.areas[user.location._id] = 1;
      set.totalAreas = user.totalAreas + 1;
    }
  }

  if(foundArea){
    Meteor.users.update({'_id': user._id}, {
        $set: set
    },{upsert: true});
  }

  return foundArea;

}


function createMessage(foundArea, foundPage, healthLost, moneyFound){
  var msg = 'Went on a search. ';

  msg += "Lost " + -1*healthLost + " health. ";

  msg += "Found " + moneyFound + " money. ";

  if (foundArea){
    msg += "Found an area. ";
  }

  if (foundPage){
    msg += "Found a page of the book. ";
  }

  return msg;

}


Meteor.methods({
    "goOnSearch": function(user){
        var now = (new Date()).getTime();
        if ( user.time < now - ((60 * 1000) * user.location.time) ){
            if (!user.location.safe){
                var lowerHealthAmount = lowerHealth(user);
                var findMoneyAmount = findMoney(user);


                // This is adding becuase lowerhealthamount is negitive
                if (user.health + lowerHealthAmount >= 0){

                  var foundArea = findArea(user);
                  var foundPage = findPage(user);


                  Meteor.users.update({'_id': user._id}, {
                      $inc: {
                          'health': lowerHealthAmount,
                          'money': findMoneyAmount,
                          'totalSearch': 1
                      },
                      $set: {
                        'time': now
                      }
                  },{upsert: true});

                  var noteMsg = createMessage(foundArea, foundPage, lowerHealthAmount, findMoneyAmount);

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

                  var backToTown = false;

                    var setDead = {
                      'time': now,
                      'health': 0,
                      'healtime': now
                    };

                    var incDead = {
                      'timesDied': 1,
                      'money': (-1*findMoneyAmount)
                    };

                    if (user.teleport > 0){
                      setDead.location = Locations.findOne({'safe': true});
                      incDead.teleport = -1;
                      backToTown = true;
                    }


                    Meteor.users.update({'_id': user._id}, {
                        $inc: incDead,
                        $set: setDead
                    });

                    var diedMsg = "You died. You lost "+ findMoneyAmount +" money. ";
                    if (backToTown){
                      diedMsg += "You teleported back to town!";
                    } else {
                      diedMsg += "You better go back to town!";
                    }


                    Meteor.call('publishNotification', {
                        title: 'Died',
                        body: diedMsg,
                        userid: user._id
                    });

                }
            }
        }
    },
    'healInTown': function(user){
        var now = (new Date()).getTime();

        // 5 minutes
        if ( user.eatTime < now - ((60 * 1000) * 5) ){
            if (user.location.safe && user.hunger >= 35){
                Meteor.users.update({'_id': user._id}, {
                    $inc: {'hunger': -3},
                    $set: {'eatTime': now}
                });
           }
        }

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

    },
    'travelingToLocation': function(user){
        var now = (new Date()).getTime();
        if (user.hasOwnProperty('traveling') && user.traveling){
            // Every 1 minute
            if ( user.time < now - ((1000 * 60) * 1) ){
                location = Locations.findOne({'_id': user.location._id});
                Meteor.users.update({'_id': user._id}, {
                    $set: {
                        'location': location,
                        'time': (new Date()).getTime(),
                        'traveling': false
                    }
                });
            }
        }
    },
    'gettingHungry': function(user){
        var now = (new Date()).getTime();
        // console.log("check hungry for " + user.profile.username);
        // Every 10 minutes
        if ( user.eatTime < now - ((1000 * 60) * 10) ){
            // console.log("10 minutes for " + user.profile.username);
            if (!user.location.safe && user.hunger < 100){
                // console.log("Hungry went up");

                var amountHurt = 0;

                if (user.hunger >= 25 && user.hunger < 50){
                    amountHurt = -4;
                }
                else if (user.hunger >= 50 && user.hunger < 75){
                    amountHurt = -8;
                }
                else if (user.hunger >= 75 && user.hunger < 100){
                    amountHurt = -16;
                }
                else if (user.hunger >= 100){
                    amountHurt = -50;
                }

                if (amountHurt > 0){
                    Meteor.call('publishNotification', {
                        title: 'Hungry',
                        body: "You are hungry. You lost " + amountHurt + " health. You better go back to town or eat!",
                        userid: user._id
                    });

                    Meteor.users.update({'_id': user._id}, {
                        $inc: {
                            'hunger': 1,
                            'health': amountHurt
                        },
                        $set: {'eatTime': now}
                    });

                }
                // console.log("Hunger goes up for " + user.profile.username);

                Meteor.users.update({'_id': user._id}, {
                    $inc: {
                        'hunger': 1
                    },
                    $set: {'eatTime': now}
                });

            }
        }
    }
});
