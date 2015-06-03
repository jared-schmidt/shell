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
        if (obj.active){

            var currentLocation = Locations.findOne({'name': key});

            if(!currentLocation){
                console.log("Adding location -> " + key);

                // TODO: Have loop though all properies?
                Locations.insert({
                    'name': key,
                    'safe': obj.safe,
                    'start': obj.start,
                    "difficulty": obj.difficulty,
                    "monsters": obj.monsters,
                    "damage": obj.damage,
                    "time": obj.time
                });
            }
        } else {
            console.log("NOT ADDING -> " + key);
        }
    }
}

function initItems(){
    if( Items.find({}).count() === 0){
         createOtherItems();
         createDefenseItems();
         createWeaponItems();
     }
}

function createOtherItems(){
    var items = JSON.parse(Assets.getText('items.json'));
    var keys = Object.keys(items.items);
    var len = keys.length;

    for(var i=0; i<len; i++){
        var key = keys[i];
        var obj = items.items[key];
        if (obj.active){
            console.log("Adding item -> " + key);
            // TODO: Have loop though all properies?
            Items.insert({
                "name": key,
                "damage": obj.damage,
                "durability": obj.durability,
                "cost": obj.cost,
                "defense": obj.defense,
                "location": obj.location,
                "action": obj.action,
                "consumable": obj.consumable
            });
        } else {
            console.log("NOT ADDING -> " + key);
        }
    }
}

function createWeaponItems(){
    var types_of_material = [
        {
            'material': "Wood",
            'durability': 1,
            'damage': 1,
            'cost': 2
        },
        {
            'material': "Rusty",
            'durability': 2,
            'damage': 2,
            'cost': 3

        },
        {
            'material': "Steel",
            'durability': 8,
            'damage': 8,
            'cost': 9
        },
        {
            'material': "Iron",
            'durability': 7,
            'damage': 6,
            'cost': 7
        },
        {
            'material': "Bronze",
            'durability': 6,
            'damage': 5,
            'cost': 6
        },
    ];

    var types_of_weapon = [
        {
            'type': "Club",
            'damage': 2,
            'cost': 3
        },
        {
            'type': "Sword",
            'damage': 4,
            'cost': 5
        },
        {
            'type': "Axe",
            'damage': 3,
            'cost': 4
        }
    ];

    _.each(types_of_material, function(material){
        _.each(types_of_weapon, function(weapon){
            var weaponItem = {
                "name": material.material + ' ' +weapon.type,
                "location": "hand",
                "damage": material.damage + weapon.damage,
                "durability": material.durability,
                "cost": material.cost + weapon.cost,
                "defense": 0,
                "consumable": false,
                "action": null,
                "active": true,
                "material": material.material,
                "type": weapon.type
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
            "type": "Boots"
        };
        insertItem(boot);

        var helmet = {
            "name": material.material + " Helmet",
            "location": "head",
            "damage": 0,
            "durability": material.durability,
            "cost": 2 + material.cost,
            "defense": 1 + material.defense,
            "consumable": false,
            "action": null,
            "active": true,
            "material": material.material,
            "type": "Helmet"
        };
        insertItem(helmet);

        var armor = {
            "name": material.material + " Armor",
            "location": "body",
            "damage": 0,
            "durability": material.durability,
            "cost": 4 + material.cost,
            "defense": 3 + material.defense,
            "consumable": false,
            "action": null,
            "active": true,
            "material": material.material,
            "type": "Armor"
        };
        insertItem(armor);

    });
}

function insertItem(item){
    if (item.active){
        console.log("Adding item -> " + item.name);
        Items.insert(item);
    } else {
        console.log("NOT ADDING -> " + key);
    }
}
