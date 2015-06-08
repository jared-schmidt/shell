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
        return {
            items: Items.find({}, {sort: {'type': 1, 'cost': 1}}).fetch()
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
    render: function(){
        return <div className="inner">
            <div className='container-fluid'>
                <ReactCSSTransitionGroup transitionName="example">
                    {this.state.items.map(this.renderItem)}
                </ReactCSSTransitionGroup>
            </div>
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
