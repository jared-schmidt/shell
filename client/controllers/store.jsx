var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.store.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Store />,
          document.getElementById('yield')
        );
    }
}

Store = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('items');
    },
    render: function(){
        return <ItemList />
    }
});

ItemList = ReactMeteor.createClass({
    getMeteorState: function(){
        var storeItems = _.groupBy(Items.find({}, {sort: {'type': 1, 'cost': 1}}).fetch(), 'type');
        return {
            armorItems: storeItems.Armor,
            bootItems: storeItems.Boots,
            helmet: storeItems.Helmet,
            axeItems: storeItems.Axe,
            clubItems: storeItems.Club,
            swordItems: storeItems.Sword,
            potionItems: storeItems.potion,
            keyItems: storeItems.key
        }
    },
    renderItem: function(model, index){
        return <Item
            key={model._id}
            itemid={model._id}
            cost={model.cost}
            damage={model.damage}
            name={model.name}
            durability={model.durability}
            defense={model.defense}
            consumable={model.consumable}
            action={model.action}
        />
    },
    renderList: function(model, header, index){
        return <div className='panel panel-default'>
            <div className='panel-heading clearfix'>
                <h3 className='panel-title pull-left'>
                    {header}
                </h3>
            </div>
            <div className="panel-body">
                {
                    model
                ?
                    <ReactCSSTransitionGroup transitionName="example">
                        {model.map(this.renderItem)}
                    </ReactCSSTransitionGroup>
                :
                    "Loading..."
                }
            </div>
        </div>
    },
    render: function(){
        return <div className="inner">
            {this.renderList(this.state.potionItems, "Potions")}

            {this.renderList(this.state.helmet, "Helmets")}
            {this.renderList(this.state.armorItems, "Armor")}
            {this.renderList(this.state.bootItems, "Boots")}

            {this.renderList(this.state.clubItems, "Clubs")}
            {this.renderList(this.state.axeItems, "Axes")}
            {this.renderList(this.state.swordItems, "Swords")}

            {this.renderList(this.state.keyItems, "Other")}
        </div>
    }
});

Item = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            owned : Meteor.user().inventory.hasOwnProperty(this.props.itemid)
        }
    },
    buyItem: function(id){
        // toastr.warning("Attempting to buy...");
        Meteor.call("buyItem", id, function(err, itemName){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Bought " + itemName);
            }
        });
    },
    render: function(){
        return <div className='col-xs-12 col-md-4'>
            <div className='panel panel-default'>

                <div className='panel-heading clearfix'>
                    <h3 className='panel-title pull-left'>
                        {this.props.name}
                    </h3>
                    <h5 className='panel-title pull-right'>
                        Cost: {this.props.cost}
                    </h5>
                </div>

                <div className="panel-body">
                    {this.props.damage ? <span>Damage: {this.props.damage} <br /></span> : null}
                    {this.props.defense ? <span>Defense: {this.props.defense}<br /></span> : null}
                    {this.props.action ? <span>{this.props.action.affects}: {this.props.action.amount}</span> : null}
                </div>

                <div className='panel-footer clearfix'>
                    {
                        this.state.owned
                    ?
                        <span>
                            <span className='travelMessage'>You have one.</span>
                            <input
                                className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                                value='Buy'
                                onClick={this.buyItem.bind(this, this.props.itemid)}
                            />
                        </span>
                    :
                        <input
                            className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                            value='Buy'
                            onClick={this.buyItem.bind(this, this.props.itemid)}
                        />
                    }

                </div>
            </div>

        </div>
    }
});
