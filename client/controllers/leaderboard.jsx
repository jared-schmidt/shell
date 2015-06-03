var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.leaderboard.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <LeaderBoard />,
          document.getElementById('yield')
        );
    }
}

LeaderBoard = ReactMeteor.createClass({
    startMeteorSubscriptions: function () {
        Meteor.subscribe('leader');
    },
    render: function(){
        return <UserList />
    }
});

UserList = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            users: Meteor.users.find({}, {sort:{'money': -1}}).fetch()
        }
    },
    renderUser: function(model, index){
        return <User
            key={model._id}
            userid={model._id}
            username={model.profile ? model.profile.username : "Loading..."}
            money={model.money}
            died={model.timesDied}
            location={model.location ? model.location.name : "Loading..."}
            health={model.health}
        />
    },
    render: function(){
        return <div className="inner">
            {
                this.state.users.length
            ?
                <div className='container-fluid'>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.state.users.map(this.renderUser)}
                    </ReactCSSTransitionGroup>
                </div>
            :
                "No Users in leaderboard"
            }
        </div>
    }
});

User = ReactMeteor.createClass({
    render: function(){
        var user = Meteor.user();
        return <div className='panel panel-default'>
            <div className="panel-body">
                <div className='row'>
                    <div className="col-md-4"><b>UserName:</b>&nbsp;{this.props.username}</div>
                    <div className="col-md-3"><b>Died:</b>&nbsp;{this.props.died}</div>
                    <div className="col-md-4"><b>Money:</b>&nbsp;{this.props.money}</div>
                    <div className="col-md-4"><b>Location:</b>&nbsp;{this.props.location}</div>
                    <div className="col-md-4"><b>Health:</b>&nbsp;{this.props.health}</div>
                </div>
            </div>
        </div>
    }
});
