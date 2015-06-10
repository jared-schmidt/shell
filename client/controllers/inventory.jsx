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
            helmet: groupedItems.Helmet,
            axeItems: groupedItems.Axe,
            clubItems: groupedItems.Club,
            swordItems: groupedItems.Sword,
            potionItems: groupedItems.potion,
            keyItems: groupedItems.key
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
    renderList: function(model, header, icon, index){
        return <div>
            {
                model
            ?
                <div className='panel panel-default'>
                    <div className='panel-heading clearfix'>
                        <h3 className='panel-title pull-left'>
                            {icon ?
                                <span>
                                    <img height="24" width="24" src={icon} />
                                    &nbsp;&mdash;&nbsp;
                                </span>
                            :
                                null
                            }

                            {header}
                        </h3>
                    </div>
                    <div className="panel-body">
                        <ReactCSSTransitionGroup transitionName="example">
                            {model.map(this.renderInventoryItem)}
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            :
                null
            }
        </div>
    },
    render: function(){
        return <div className="inner">
            {this.renderList(this.state.potionItems, "Potions", "/icons/potion-ball.png")}

            {this.renderList(this.state.helmet, "Helmets", "/icons/visored-helm.png")}
            {this.renderList(this.state.armorItems, "Armor", "/icons/breastplate.png")}
            {this.renderList(this.state.bootItems, "Boots", "/icons/boots.png")}

            {this.renderList(this.state.clubItems, "Clubs", "/icons/baseball-bat.png")}
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
            <div className='panel panel-default'>

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
                        {this.props.durability ? <span>Durability: {this.props.durability}<br /></span> : null }
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
