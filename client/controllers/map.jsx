var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.map.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Map />,
          document.getElementById('yield')
        );
    }
}

Map = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('locations');
        Meteor.subscribe('items');
    },
    render: function(){
        return <LocationList />
    }
});

LocationList = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            locations: Locations.find({}, {sort: {'difficulty': 1, 'damage': 1}}).fetch()
        }
    },
    renderLocation: function(model, index){
        return <Location
            key={model._id}
            locationid={model._id}
            name={model.name}
            time={model.time}
            monsters={model.monsters}
            safe={model.safe}
            difficulty={model.difficulty}
            areas={model.areas}
            needsKey={model.key}
            monsterType={model.monsterType}/>
    },
    render: function(){
        return <div className="inner">
            <div className='container-fluid'>
                <ReactCSSTransitionGroup transitionName="example">
                    {this.state.locations.map(this.renderLocation)}
                </ReactCSSTransitionGroup>
            </div>
        </div>
    }
});

Location = ReactMeteor.createClass({
    getMeteorState: function(){
        var user = Meteor.user();
        var areasLeft = 0;

        var hasKey = false;

        if (this.props.needsKey){
            for (var key in user.inventory) {
               if (user.inventory.hasOwnProperty(key)) {
                   var obj = user.inventory[key];
                   itemInfo = Items.find({'_id': key}).fetch()[0];
                    if(itemInfo){
                        if(itemInfo.action && itemInfo.action.affects === 'location'){
                            if (itemInfo.action && itemInfo.action.amount.toLowerCase() == this.props.name.toLowerCase()){
                                hasKey = true;
                            }
                        }
                    }
                }
            }

        } else {
            // return_location.push(location._id);
        }


        // if(user.hasOwnProperty('areas') && user.areas.hasOwnProperty(this.props.locationid)){
        //     areasLeft = areasLeft - user.areas[this.props.locationid];
        // }
        return {
            currentLocation: user.location._id,
            userHealth: user.health,
            areasLeft: areasLeft,
            hasKey: hasKey,
            isTraveling: user.traveling

        }
    },
    changeLocation: function(id){
        // toastr.warning("Attempting to move...");
        Meteor.call("changeLocation", id, function(err, locationName){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Traveling to " + locationName);
            }
        });
    },
    youAreHere: function(placeID, userLocationID, isTraveling, needsKey){
        var msg = "";

        if (placeID === userLocationID && !isTraveling){
            msg = "Here";
        } else if (placeID != userLocationID && needsKey){
            msg = "Need's Item";
        } else if (placeID === userLocationID  && isTraveling){
            msg = "Traveling";
        }

        return msg;
    },
    render: function(){
        return <div className='col-xs-12 col-md-4'>
            <div className='panel panel-default'>

                <div className='panel-heading clearfix'>
                    <h3 className='panel-title pull-left'>
                        {this.props.name}
                    </h3>
                </div>

                <div className="panel-body">
                    { this.state.areasLeft > 0 ? <span>Areas Left: {this.state.areasLeft}<br /></span> : null}
                    Time: {this.props.time} minute(s)
                    <br />
                    Difficulty: {this.props.difficulty}
                    <br />
                    Monsters: {this.props.monsters}
                    <br />
                    Kind of monsters: {this.props.monsterType ? this.props.monsterType : "None"}
                </div>

                <div className='panel-footer clearfix'>
                    {
                        ((this.state.currentLocation != this.props.locationid && (this.state.userHealth > 0 || this.props.safe)) && (this.state.hasKey && this.props.needsKey)) || (!this.props.needsKey && this.state.currentLocation != this.props.locationid )
                        ?
                        <input
                            className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                            value='Travel'
                            onClick={this.changeLocation.bind(this, this.props.locationid)}
                        />
                        :
                        <span>
                            <span className='travelMessage'>{this.youAreHere(this.props.locationid, this.state.currentLocation, this.state.isTraveling, this.props.needsKey)}</span>
                            <input
                                className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                                value='Travel'
                                onClick={this.changeLocation.bind(this, this.props.locationid)}
                                disabled="true"
                            />
                        </span>
                    }
                </div>
            </div>

        </div>
    }
});
