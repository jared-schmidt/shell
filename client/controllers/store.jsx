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
            keyItems: storeItems.key,
            foodItems: storeItems.food
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
            img={model.img}
        />
    },
    renderList: function(model, header, icon){
        var collapseId = "#collapse" + header;
        var controls = 'collapse' + header;
        var headering = 'heading' + header;
        return <div className='panel panel-default'>
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
                        {header}
                    </a>
                </h3>
            </div>

            <div id={controls} className="panel-collapse collapse" role="tabpanel" aria-labelledby={headering}>
                <div className="panel-body">
                    {
                        model
                    ?
                        <span>{model.map(this.renderItem)}</span>
                    :
                        "Loading..."
                    }
                </div>
            </div>
        </div>
    },
    render: function(){
        return <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

            {this.renderList(this.state.potionItems, "Potions", "/icons/potion-ball.png")}
            {this.renderList(this.state.foodItems, "Food", "/icons/chicken-leg.png")}

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

Item = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            owned : Meteor.user().inventory.hasOwnProperty(this.props.itemid) && Meteor.user().inventory[this.props.itemid] > 0
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
            <div className='panel panel-default inside-panel'>

                <div className='panel-heading clearfix'>
                    <h3 className='panel-title pull-left'>
                        {this.props.name}
                    </h3>
                    <h5 className='panel-title pull-right'>
                        Cost: {this.props.cost}
                    </h5>
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
                        this.state.owned
                    ?
                        <span>
                            <span className='travelMessage'>Own</span>
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
