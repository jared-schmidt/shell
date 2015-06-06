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
        return {
            items: items_value
        }
    },
    renderInventoryItem: function(model, index){
        console.log(model);
        return <InventoryItem
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
        />
    },
    render: function(){
        return <div className="inner">
            {
                this.state.items.length
            ?
                <div className='container-fluid'>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.state.items.map(this.renderInventoryItem)}
                    </ReactCSSTransitionGroup>
                </div>
            :
                "Nothing in inventory"
            }
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
                    {this.props.damage ? <span>Damage: {this.props.damage} <br /></span> : null}
                    {this.props.durability ? <span>Durability: {this.props.durability}<br /></span> : null }
                    {this.props.defense ? <span>Defense: {this.props.defense}<br /></span> : null}
                    {this.props.action ? <span>{this.props.action.affects}: {this.props.action.amount}</span> : null}
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
