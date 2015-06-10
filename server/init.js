Meteor.startup(function (){
   initLocations();
   initItems();
});


function initLocations(){

    var locations = JSON.parse(Assets.getText("locations.json"));
    var keys = Object.keys(locations.locations);
    var len = keys.length;

    for(var i=0; i<len; i++){
        var key = keys[i];
        var obj = locations.locations[key];
        var currentLocation = Locations.findOne({'name': key}, {fields:{'_id': 0}});
        if (obj.active){

            var newLocation = {
                'name': key,
                'safe': obj.safe,
                'start': obj.start,
                "difficulty": obj.difficulty,
                "monsters": obj.monsters,
                "damage": obj.damage,
                "time": obj.time,
                "areas": obj.areas,
                "monsterType": obj.monsterType,
                "key": obj.key
            };

            if(!currentLocation){
                console.log("Adding location -> " + key);

                // TODO: Have loop though all properies?
                Locations.insert(newLocation);
            } else {
                if (!_.isEqual(newLocation, currentLocation)){
                    console.log("Update " + currentLocation.name);
                    Locations.update({'name': currentLocation.name}, newLocation);
                }
            }
        } else {
            console.log("NOT ADDING -> " + key);
            if(currentLocation){
                console.log("Removing -> " + key);
                Locations.remove({'name': currentLocation.name});
            }
        }
    }
}

function initItems(){
    createDefenseItems();
    createOtherItems();
    createWeaponItems();
}

function createOtherItems(){
    var items = JSON.parse(Assets.getText('items.json'));
    var keys = Object.keys(items.items);
    var len = keys.length;

    for(var i=0; i<len; i++){
        var key = keys[i];
        var obj = items.items[key];
        var currentItem = Items.findOne({'name': key}, {fields:{'_id': 0}});
        if (obj.active){

            var newItem = {
                "name": key,
                "damage": obj.damage,
                "durability": obj.durability,
                "cost": obj.cost,
                "defense": null,
                "location": null,
                "action": obj.action,
                "consumable": obj.consumable,
                "usable": obj.usable,
                "type": obj.type,
                "img": obj.img
            };

            if(!currentItem){
                console.log("Adding item -> " + key);

                // TODO: Have loop though all properies?
                Items.insert(newItem);
            } else {
                if (!lodash.isEqual(newItem, currentItem)){
                    console.log("Update " + currentItem.name);
                    Items.update({'name': currentItem.name}, newItem);
                }
            }

        } else {
            console.log("NOT ADDING -> " + key);
            if(currentItem){
                console.log("Removing -> " + key);
                Items.remove({'name': currentItem.name});
            }
        }
    }
}

function createWeaponItems(){
    var types_of_material = [
        {
            'material': "Cardboard",
            'durability': 1,
            'damage': 0,
            'cost': 1
        },
        {
            'material': "Wood",
            'durability': 3,
            'damage': 3,
            'cost': 4
        },
        {
            'material': "Rusty",
            'durability': 5,
            'damage': 5,
            'cost': 6

        },
        {
            'material': "Steel",
            'durability': 8,
            'damage': 8,
            'cost': 13
        },
        {
            'material': "Iron",
            'durability': 7,
            'damage': 6,
            'cost': 8
        },
        {
            'material': "Bronze",
            'durability': 6,
            'damage': 5,
            'cost': 10
        },
        {
            'material': "Silver",
            'durability': 8,
            'damage': 11,
            'cost': 23
        },
        {
            'material': "Gold",
            'durability': 9,
            'damage': 15,
            'cost': 30
        },
        {
            'material': "Diamond",
            'durability': 100,
            'damage': 23,
            'cost': 150
        }
    ];

    var types_of_weapon = [
        {
            'type': "Club",
            'damage': 2,
            'durability': 3,
            'cost': 3,
            'twoHanded': false,
            'img': "/icons/baseball-bat.png"
        },
        {
            'type': "Sword",
            'damage': 4,
            'durability': 4,
            'cost': 5,
            'twoHanded': false,
            'img': "/icons/broadsword.png"
        },
        {
            'type': "Axe",
            'damage': 3,
            'cost': 4,
            'durability': 5,
            'twoHanded': false,
            'img': "/icons/battle-axe.png"
        },
        {
            'type': "Spear",
            'damage': 7,
            'cost': 6,
            'durability': 3,
            'twoHanded': true,
            'img': "/icons/stone-spear.png"
        }
    ];

    _.each(types_of_material, function(material){
        _.each(types_of_weapon, function(weapon){
            var itemName = material.material + ' ' +weapon.type;
            var weaponItem = {
                "name": itemName,
                "location": "hand",
                "damage": material.damage + weapon.damage,
                "durability": material.durability + weapon.durability,
                "cost": material.cost + weapon.cost,
                "defense": 0,
                "consumable": false,
                "action": null,
                "active": true,
                "material": material.material,
                "type": weapon.type,
                "usable": true,
                "img": weapon.img,
                "twoHanded": weapon.twoHanded
            };
            insertItem(weaponItem);
        });
    });
}

function createDefenseItems(){
    var types_of_material = [
        {
            'material': "Leather",
            'durability': 7,
            'defense': 3,
            'cost': 3
        },
        {
            'material': "Iron",
            'durability': 8,
            'defense': 8,
            'cost': 7
        },
        {
            'material': "Bronze",
            'durability': 6,
            'defense': 6,
            'cost': 6
        },
        {
            'material': "Steel",
            'durability': 10,
            'defense': 10,
            'cost': 10
        },
        {
            'material': "Paper",
            'durability': 1,
            'defense': 1,
            'cost': 1
        },
        {
            'material': "Silver",
            'durability': 8,
            'defense': 11,
            'cost': 15
        },
        {
            'material': "Gold",
            'durability': 9,
            'defense': 15,
            'cost': 20
        },
        {
            'material': "Diamond",
            'durability': 100,
            'defense': 45,
            'cost': 240
        }
    ];

    _.each(types_of_material, function(material){
        var boot = {
            "name": material.material + " Boots",
            "location": "feet",
            "damage": 0,
            "durability": material.durability,
            "cost": 1 + material.cost,
            "defense": material.defense,
            "consumable": false,
            "action": null,
            "active": true,
            "material": material.material,
            "type": "Boots",
            "usable": true,
            "img": "/icons/boots.png"
        };
        insertItem(boot);

        var helmet = {
            "name": material.material + " Helmet",
            "location": "head",
            "damage": 0,
            "durability": material.durability,
            "cost": 3 + material.cost,
            "defense": 1 + material.defense,
            "consumable": false,
            "action": null,
            "active": true,
            "material": material.material,
            "type": "Helmet",
            "usable": true,
            "img": "/icons/visored-helm.png"
        };
        insertItem(helmet);

        var armor = {
            "name": material.material + " Armor",
            "location": "body",
            "damage": 0,
            "durability": material.durability,
            "cost": 6 + material.cost,
            "defense": 3 + material.defense,
            "consumable": false,
            "action": null,
            "active": true,
            "material": material.material,
            "type": "Armor",
            "usable": true,
            "img": "/icons/breastplate.png"
        };
        insertItem(armor);
    });
}

function insertItem(item){
    if (item.active){
        var currentItem = Items.findOne({'name': item.name}, {fields: {'_id': 0}});
        if (!currentItem){
            console.log("Adding item -> " + item.name);
            Items.insert(item);
        } else {
            if(!lodash.isEqual(currentItem, item)){
                console.log("Update " + currentItem.name);
                Items.update({'name': currentItem.name}, item);
            }
        }
    } else {
        console.log("NOT ADDING -> " + key);
    }
}
