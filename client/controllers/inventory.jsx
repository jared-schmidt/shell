var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.inventory.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Inventory />,
          document.getElementById('yield')
        );
    }
}

Inventory = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('items');
    },
    render: function(){
        return <InventoryList />
    }
});

InventoryList = ReactMeteor.createClass({
    getMeteorState: function(){
        var user = Meteor.user();
        var items_value = [];
        if(user){

            for (var key in user.inventory) {
               if (user.inventory.hasOwnProperty(key)) {
                   var obj = user.inventory[key];
                   itemInfo = Items.find({'_id': key}).fetch()[0];
                    if(itemInfo){
                        itemInfo['ownCount'] = obj;
                        items_value.push(itemInfo);
                    }
                }
            }
        }
        var groupedItems = _.groupBy(items_value, 'type');
        return {
            armorItems: groupedItems.Armor,
            bootItems: groupedItems.Boots,
            helmetItems: groupedItems.Helmet,
            shieldItems: groupedItems.Shield,
            axeItems: groupedItems.Axe,
            clubItems: groupedItems.Club,
            spearItems: groupedItems.Spear,
            swordItems: groupedItems.Sword,
            potionItems: groupedItems.potion,
            keyItems: groupedItems.key,
            foodItems: groupedItems.food
        }
    },
    renderInventoryItem: function(model, index){
        var shouldShow = model.ownCount > 0;
        return <div>{
            shouldShow
        ?
            <InventoryItem
            key={model._id}
            itemid={model._id}
            cost={model.cost}
            damage={model.damage}
            name={model.name}
            durability={model.durability}
            defense={model.defense}
            location={model.location}
            consumable={model.consumable}
            action={model.action}
            count={model.ownCount}
            usable={model.usable}
            img={model.img}
            />
        :
            null
        }</div>
    },
    renderList: function(model, header, icon){
        var collapseId = "#collapse" + header;
        var controls = 'collapse' + header;
        var headering = 'heading' + header;
        var itemCount = 0;

        _.each(model, function(item){
            itemCount += item.ownCount;
        });



        return <div>
            {
                model && itemCount > 0
            ?
                <div className='panel panel-default'>
                    <div className='panel-heading clearfix'>
                        <h3 className='panel-title pull-left' role="tab" id={headering}>
                            {icon ?
                                <span>
                                    <img height="24" width="24" src={icon} />
                                    &nbsp;&mdash;&nbsp;
                                </span>
                            :
                                null
                            }

                            <a data-toggle="collapse" data-parent="#accordion" href={collapseId} aria-expanded="false" aria-controls={controls} >
                                {header} - {itemCount}
                            </a>

                        </h3>
                    </div>

                    <div id={controls} className="panel-collapse collapse" role="tabpanel" aria-labelledby={headering}>
                        <div className="panel-body">
                            {
                                model
                            ?
                                <span>{model.map(this.renderInventoryItem)}</span>
                            :
                                "Loading..."
                            }
                        </div>
                    </div>
                </div>
            :
                null
            }
        </div>
    },
    render: function(){
        return <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            {this.renderList(this.state.potionItems, "Potions", "/icons/potion-ball.png")}

            {this.renderList(this.state.foodItems, "Food", "/icons/chicken-leg.png")}

            {this.renderList(this.state.helmetItems, "Helmets", "/icons/visored-helm.png")}
            {this.renderList(this.state.armorItems, "Armor", "/icons/breastplate.png")}
            {this.renderList(this.state.bootItems, "Boots", "/icons/boots.png")}
            {this.renderList(this.state.shieldItems, "Shield")}


            {this.renderList(this.state.clubItems, "Clubs", "/icons/baseball-bat.png")}
            {this.renderList(this.state.spearItems, "Spears", "/icons/stone-spear.png")}
            {this.renderList(this.state.axeItems, "Axes", "/icons/battle-axe.png")}
            {this.renderList(this.state.swordItems, "Swords", "/icons/broadsword.png")}

            {this.renderList(this.state.keyItems, "Other")}
        </div>
    }
});

InventoryItem = ReactMeteor.createClass({
    getMeteorState: function(){
        var user = Meteor.user();
        return {
            equipment: user.equipment
        }
    },
    wearItem: function(id){
        Meteor.call("wearItem", id, function(err){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Put on item");
            }
        });
    },
    useItem: function(id){
        Meteor.call("useItem", id, function(err){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Used item");
            }
        });
    },
    removeItem: function(id){
        Meteor.call('removeItem', id, function(err){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Removed item");
            }
        });
    },
    isWearing: function(){
        var itemid = this.props.itemid;
        var itemLocation = this.props.location;

        var isWearing = false;

        for (var key in this.state.equipment) {
           if (this.state.equipment.hasOwnProperty(key)) {
               var obj = this.state.equipment[key];
               // console.log(key + ' = ' + obj);
               if (obj === itemid){
                    isWearing = true;
                    break;
               }
            }
        }
        return isWearing;

    },

    render: function(){
        var actionButton;
        if (this.props.usable){
            if(this.props.consumable){
                actionButton = <input
                    className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                    value='Use'
                    onClick={this.useItem.bind(this, this.props.itemid)}
                />
            } else {
                actionButton = <input
                    className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                    value='Wear'
                    onClick={this.wearItem.bind(this, this.props.itemid)}
                />
            }
        } else {
           actionButton = null;
        }

        return <div className='col-xs-12 col-md-4'>
            <div className='panel panel-default inside-panel'>

                <div className='panel-heading clearfix'>
                    <h3 className='panel-title pull-left'>
                        {this.props.name}
                    </h3>
                    <h3 className='panel-title pull-right'>
                        Own: {this.props.count}
                    </h3>
                </div>

                <div className="panel-body">

                    <span className='pull-left clearfix'>
                        {this.props.img
                        ?
                            <img className='itemSymbol' height="32" width="32" src={this.props.img} />
                        :
                            null
                        }
                    </span>

                    <span>
                        {this.props.damage ? <span>Damage: {this.props.damage} <br /></span> : null}
                        {this.props.defense ? <span>Defense: {this.props.defense}<br /></span> : null}
                        {this.props.action ? <span>{this.props.action.affects}: {this.props.action.amount}</span> : null}
                    </span>
                </div>

                <div className='panel-footer clearfix'>
                    {
                        this.isWearing()
                        ?
                        <span>
                            <span className='travelMessage'>Wearing</span>
                            <input
                                className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                                value='Remove'
                                onClick={this.removeItem.bind(this, this.props.itemid)}
                            />
                        </span>
                        :
                        {actionButton}
                    }
                </div>
            </div>

        </div>
    }
});
