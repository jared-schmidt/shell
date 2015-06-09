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
        // var hasKey = Items.findOne({'name': model.key});
        // console.log(hasKey);

        return <Location
            key={model._id}
            locationid={model._id}
            name={model.name}
            time={model.time}
            monsters={model.monsters}
            safe={model.safe}
            difficulty={model.difficulty}
        />
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
        return {
            currentLocation: user.location._id,
            userHealth: user.health
        }
    },
    changeLocation: function(id){
        // toastr.warning("Attempting to move...");
        Meteor.call("changeLocation", id, function(err, locationName){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Traveled to " + locationName);
            }
        });
    },
    youAreHere: function(placeID, userLocationID){
        var msg = "Can't travel here";

        if (placeID === userLocationID){
            msg = "You are here";
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
                    Time: {this.props.time} minute(s)
                    <br />
                    Difficulty: {this.props.difficulty}
                    <br />
                    Monsters: {this.props.monsters}
                </div>

                <div className='panel-footer clearfix'>
                    {
                        this.state.currentLocation != this.props.locationid && (this.state.userHealth > 0 || this.props.safe)
                        ?
                        <input
                            className='btn btn-primary pull-right btn-width btn-material-blue-grey'
                            value='Travel'
                            onClick={this.changeLocation.bind(this, this.props.locationid)}
                        />
                        :
                        <span>
                            <span className='travelMessage'>{this.youAreHere(this.props.locationid, this.state.currentLocation)}</span>
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
